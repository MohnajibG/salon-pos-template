import mongoose from "mongoose";

import Ticket from "../models/Ticket";
import Client from "../models/Client";
import User from "../models/User";
import Service from "../models/Service";
import Appointment from "../models/Appointment";
import CashRegister from "../models/CashRegister";
import {
  getCurrentCashRegister,
  recalculateTotals,
} from "./cashRegister.service";

interface CreateTicketData {
  client: string;
  appointment?: string;
  items: {
    service: string;
    employee: string;
    finalPrice: number;
  }[];
  discount?: number;
  paymentMethod: "cash" | "card" | "transfer";
  notes?: string;
  createdBy: string;
}

const generateTicketNumber = async () => {
  const count = await Ticket.countDocuments();
  const number = (count + 1).toString().padStart(6, "0");
  const year = new Date().getFullYear();

  return `TCK-${year}-${number}`;
};

const buildItems = async (
  rawItems: { service: string; employee: string; finalPrice: number }[],
) => {
  const employeeIds = rawItems.map((item) => item.employee);

  const employees = await User.find({
    _id: {
      $in: employeeIds,
    },
    role: "employee",
    isActive: true,
  });

  if (employees.length !== new Set(employeeIds).size) {
    throw new Error("Employé invalide");
  }

  const serviceIds = rawItems.map((item) => item.service);

  const services = await Service.find({
    _id: {
      $in: serviceIds,
    },
    isDeleted: false,
    isActive: true,
  });

  if (services.length !== new Set(serviceIds).size) {
    throw new Error("Service invalide");
  }

  return rawItems.map((raw) => {
    const service = services.find(
      (s) => s._id.toString() === raw.service.toString(),
    )!;

    return {
      service: service._id,
      employee: raw.employee,
      name: service.name,
      originalPrice: service.price,
      finalPrice: raw.finalPrice ?? service.price,
      duration: service.duration,
    };
  });
};

export const createTicket = async (data: CreateTicketData) => {
  const cashRegister = await getCurrentCashRegister(data.createdBy);

  if (!cashRegister) {
    throw new Error(
      "Aucune caisse ouverte. Veuillez ouvrir votre caisse avant d'encaisser.",
    );
  }
  const client = await Client.findOne({
    _id: data.client,
    isDeleted: false,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable");
  }

  const items = await buildItems(data.items);

  const subtotal = items.reduce((sum, item) => sum + item.finalPrice, 0);

  const discount = data.discount ?? 0;

  const total = Math.max(subtotal - discount, 0);

  const ticket = await Ticket.create({
    ticketNumber: await generateTicketNumber(),
    client: data.client,
    appointment: data.appointment,
    cashRegister: cashRegister._id,
    items,
    subtotal,
    discount,
    total,
    paymentMethod: data.paymentMethod,
    notes: data.notes,
    status: "paid",
    createdBy: data.createdBy,
  });

  await Client.findByIdAndUpdate(client._id, {
    $inc: {
      loyaltyPoints: Math.floor(total / 100),
      totalSpent: total,
      visitCount: 1,
    },
    lastVisit: new Date(),
  });

  await recalculateTotals(cashRegister._id.toString());

  return ticket;
};

export const getTickets = async (filter: any = {}) => {
  return Ticket.find(filter)

    .populate("client", "firstName lastName phone")

    .populate("items.employee", "firstName lastName speciality")

    .populate("items.service", "name price duration")

    .sort({
      createdAt: -1,
    });
};

export const getTicketById = async (id: string) => {
  return Ticket.findById(id)

    .populate("client")

    .populate("items.employee")

    .populate("items.service");
};

const assertRegisterEditable = async (
  cashRegisterId: mongoose.Types.ObjectId | null | undefined,
) => {
  if (!cashRegisterId) return;

  const register = await CashRegister.findById(cashRegisterId);

  if (register?.status === "finalized") {
    throw new Error(
      "Cette caisse a été finalisée par l'administrateur : le ticket ne peut plus être modifié",
    );
  }
};

export const cancelTicket = async (id: string, userId: string) => {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new Error("Ticket introuvable");
  }

  if (ticket.status === "cancelled") {
    throw new Error("Ticket déjà annulé");
  }

  await assertRegisterEditable(ticket.cashRegister);

  const client = await Client.findById(ticket.client);

  if (client) {
    await Client.findByIdAndUpdate(client._id, {
      $inc: {
        totalSpent: -ticket.total,
        visitCount: -1,
        loyaltyPoints: -Math.floor(ticket.total / 100),
      },
    });
  }

  ticket.status = "cancelled";

  ticket.cancelledBy = new mongoose.Types.ObjectId(userId);

  ticket.cancelledAt = new Date();

  await ticket.save();

  if (ticket.cashRegister) {
    await recalculateTotals(ticket.cashRegister.toString());
  }

  return ticket;
};

interface UpdateTicketAdminData {
  items?: { service: string; employee: string; finalPrice: number }[];
  discount?: number;
  paymentMethod?: "cash" | "card" | "transfer";
  notes?: string;
}

/**
 * Modification d'un ticket par un admin, y compris déjà payé.
 * Garde une trace de l'état précédent dans `edits` pour audit,
 * et répercute l'écart de total sur les stats client + la caisse.
 */
export const updateTicketAdmin = async (
  id: string,
  data: UpdateTicketAdminData,
  adminId: string,
) => {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new Error("Ticket introuvable");
  }

  if (ticket.status === "cancelled") {
    throw new Error("Impossible de modifier un ticket annulé");
  }

  await assertRegisterEditable(ticket.cashRegister);

  const previousTotal = ticket.total;

  const previousSnapshot = {
    items: ticket.items,
    subtotal: ticket.subtotal,
    discount: ticket.discount,
    total: ticket.total,
    paymentMethod: ticket.paymentMethod,
    notes: ticket.notes,
  };

  if (data.items) {
    ticket.items = (await buildItems(
      data.items,
    )) as unknown as typeof ticket.items;
  }

  const subtotal = ticket.items.reduce(
    (sum, item) => sum + item.finalPrice,
    0,
  );

  const discount = data.discount ?? ticket.discount;
  const total = Math.max(subtotal - discount, 0);

  ticket.subtotal = subtotal;
  ticket.discount = discount;
  ticket.total = total;
  ticket.paymentMethod = data.paymentMethod ?? ticket.paymentMethod;
  ticket.notes = data.notes ?? ticket.notes;

  ticket.edits = ticket.edits ?? [];
  ticket.edits.push({
    editedBy: new mongoose.Types.ObjectId(adminId),
    editedAt: new Date(),
    previous: previousSnapshot,
  });

  await ticket.save();

  if (ticket.status === "paid") {
    const totalDelta = total - previousTotal;

    if (totalDelta !== 0) {
      await Client.findByIdAndUpdate(ticket.client, {
        $inc: {
          totalSpent: totalDelta,
          loyaltyPoints:
            Math.floor(total / 100) - Math.floor(previousTotal / 100),
        },
      });
    }
  }

  if (ticket.cashRegister) {
    await recalculateTotals(ticket.cashRegister.toString());
  }

  return ticket;
};

export const createTicketFromAppointment = async (
  data: CreateTicketData & {
    appointment: string;
  },
) => {
  const appointment = await Appointment.findById(data.appointment);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (appointment.status === "cancelled") {
    throw new Error("Impossible de facturer un rendez-vous annulé");
  }

  const ticket = await createTicket(data);

  appointment.status = "paid";

  await appointment.save();

  return ticket;
};

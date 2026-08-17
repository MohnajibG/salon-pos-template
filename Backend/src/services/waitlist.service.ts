import Waitlist from "../models/Waitlist";
import Client from "../models/Client";
import Service from "../models/Service";
import User from "../models/User";
import { createAppointment } from "./appointment.service";
import { isPastCalendarDate } from "../utils/time";

interface CreateWaitlistEntryData {
  client: string;
  services: { service: string; employee?: string }[];
  desiredDateFrom: Date;
  desiredDateTo?: Date;
  notes?: string;
  createdBy: string;
}

export const createWaitlistEntry = async (data: CreateWaitlistEntryData) => {
  const client = await Client.findOne({
    _id: data.client,
    isDeleted: false,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable ou désactivé");
  }

  if (!data.services?.length) {
    throw new Error("Veuillez sélectionner au moins une prestation");
  }

  if (isPastCalendarDate(data.desiredDateFrom)) {
    throw new Error(
      "Impossible d'ajouter une entrée en liste d'attente dans le passé",
    );
  }

  const serviceIds = data.services.map((item) => item.service);

  const services = await Service.find({
    _id: { $in: serviceIds },
    isDeleted: false,
    isActive: true,
  });

  if (services.length !== new Set(serviceIds).size) {
    throw new Error("Service invalide");
  }

  const employeeIds = data.services
    .map((item) => item.employee)
    .filter((id): id is string => !!id);

  if (employeeIds.length) {
    const employees = await User.find({
      _id: { $in: employeeIds },
      role: "employee",
      isActive: true,
    });

    if (employees.length !== new Set(employeeIds).size) {
      throw new Error("Employé invalide");
    }
  }

  return Waitlist.create({
    client: data.client,
    services: data.services,
    desiredDateFrom: data.desiredDateFrom,
    desiredDateTo: data.desiredDateTo,
    notes: data.notes,
    status: "waiting",
    createdBy: data.createdBy,
  });
};

export const getWaitlist = async (filter: { status?: string } = {}) => {
  const query: Record<string, unknown> = {};

  if (filter.status) query.status = filter.status;

  return Waitlist.find(query)
    .populate("client", "firstName lastName phone")
    .populate("services.service", "name price duration")
    .populate("services.employee", "firstName lastName speciality")
    .sort({ createdAt: 1 });
};

interface FindMatchesParams {
  employeeId?: string;
  date: Date;
  serviceIds: string[];
}

export const findMatchesForSlot = async ({
  employeeId,
  date,
  serviceIds,
}: FindMatchesParams) => {
  const entries = await Waitlist.find({
    status: "waiting",
    services: employeeId
      ? {
          $elemMatch: {
            service: { $in: serviceIds },
            $or: [{ employee: { $exists: false } }, { employee: employeeId }],
          },
        }
      : { $elemMatch: { service: { $in: serviceIds } } },
    desiredDateFrom: { $lte: date },
    $or: [
      { desiredDateTo: { $exists: false } },
      { desiredDateTo: { $gte: date } },
    ],
  })
    .populate("client", "firstName lastName phone")
    .populate("services.service", "name price duration")
    .populate("services.employee", "firstName lastName speciality")
    .sort({ createdAt: 1 });

  return entries;
};

interface ConvertWaitlistData {
  services: { service: string; employee: string }[];
  date: Date;
  startTime: string;
  source?: "admin" | "cashier" | "online";
  notes?: string;
  createdBy: string;
}

export const convertWaitlistEntry = async (
  waitlistId: string,
  appointmentData: ConvertWaitlistData,
) => {
  const entry = await Waitlist.findById(waitlistId);

  if (!entry) {
    throw new Error("Entrée de liste d'attente introuvable");
  }

  if (entry.status !== "waiting") {
    throw new Error("Cette entrée n'est plus en attente");
  }

  const appointment = await createAppointment({
    client: entry.client.toString(),
    services: appointmentData.services,
    date: appointmentData.date,
    startTime: appointmentData.startTime,
    source: appointmentData.source,
    notes: appointmentData.notes,
    createdBy: appointmentData.createdBy,
  });

  entry.status = "matched";
  entry.matchedAppointment = appointment._id as any;

  await entry.save();

  return appointment;
};

export const cancelWaitlistEntry = async (id: string) => {
  const entry = await Waitlist.findById(id);

  if (!entry) {
    throw new Error("Entrée de liste d'attente introuvable");
  }

  entry.status = "cancelled";

  await entry.save();

  return entry;
};

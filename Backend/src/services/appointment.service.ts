import Appointment, { AppointmentStatus } from "../models/Appointment";
import Client from "../models/Client";
import User from "../models/User";
import Service from "../models/Service";
import Ticket from "../models/Ticket";
import { timeToMinutes, minutesToTime, isPastCalendarDate } from "../utils/time";
import { assertEmployeeAvailable } from "./availability.service";

interface CreateAppointmentData {
  client: string;
  services: {
    service: string;
    employee: string;
  }[];
  date: Date;
  startTime: string;
  source?: "admin" | "cashier" | "online";
  notes?: string;
  createdBy: string;
}

export interface AppointmentFilter {
  status?: AppointmentStatus;
  employeeId?: string;
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface UpdateAppointmentData {
  date?: Date;
  startTime?: string;
  services?: { service: string; employee: string }[];
  status?: AppointmentStatus;
  notes?: string;
  noShowReason?: string;
  updatedBy: string;
}

const ATTENDED_STATUSES: AppointmentStatus[] = ["completed", "paid"];

/**
 * Répercute un changement de statut sur les compteurs de fiabilité
 * du client (présence / absence), en ne comptant que la traversée
 * de frontière (ex: completed -> paid ne recompte pas une 2e fois).
 */
const applyClientReliabilityDelta = async (
  clientId: unknown,
  previousStatus: AppointmentStatus,
  nextStatus: AppointmentStatus,
) => {
  if (previousStatus === nextStatus) return;

  const wasAttended = ATTENDED_STATUSES.includes(previousStatus);
  const isAttended = ATTENDED_STATUSES.includes(nextStatus);
  const wasNoShow = previousStatus === "no_show";
  const isNoShow = nextStatus === "no_show";

  const inc: Record<string, number> = {};

  if (!wasAttended && isAttended) inc.attendedCount = 1;
  if (wasAttended && !isAttended) inc.attendedCount = -1;
  if (!wasNoShow && isNoShow) inc.noShowCount = 1;
  if (wasNoShow && !isNoShow) inc.noShowCount = -1;

  if (Object.keys(inc).length) {
    await Client.findByIdAndUpdate(clientId, { $inc: inc });
  }
};

/**
 * Valide client/services/employés et construit le snapshot des services
 * (réutilisé par la création simple et par la récurrence)
 */
export const buildAppointmentSnapshot = async (data: {
  client: string;
  services: { service: string; employee: string }[];
}) => {
  if (!data.services.length) {
    throw new Error("Veuillez sélectionner au moins une prestation");
  }

  if (data.services.some((item) => !item.service || !item.employee)) {
    throw new Error(
      "Chaque prestation doit avoir un service et un employé assignés",
    );
  }

  const client = await Client.findOne({
    _id: data.client,
    isDeleted: false,
    isActive: true,
  });

  if (!client) {
    throw new Error("Client introuvable ou désactivé");
  }

  const serviceIds = data.services.map((item) => item.service);

  const services = await Service.find({
    _id: { $in: serviceIds },
    isDeleted: false,
    isActive: true,
  });

  if (services.length !== data.services.length) {
    throw new Error("Service invalide");
  }

  const employeeIds = data.services.map((item) => item.employee);

  const employees = await User.find({
    _id: { $in: employeeIds },
    role: "employee",
    isActive: true,
  });

  if (employees.length !== new Set(employeeIds).size) {
    throw new Error("Employé invalide");
  }

  for (const item of data.services) {
    const service = services.find((s) => s._id.toString() === item.service);
    const employee = employees.find((e) => e._id.toString() === item.employee);

    // Les prestations créées avant l'ajout du champ spécialité n'en ont pas
    // encore : on ne bloque pas la prise de rendez-vous dans ce cas
    if (
      service &&
      employee &&
      service.speciality &&
      service.speciality !== employee.speciality
    ) {
      throw new Error(
        `${employee.firstName} ${employee.lastName} (${employee.speciality}) ne peut pas réaliser "${service.name}" (spécialité requise : ${service.speciality})`,
      );
    }
  }

  const serviceSnapshot = data.services.map((item) => {
    const service = services.find((s) => s._id.toString() === item.service);

    if (!service) {
      throw new Error("Service introuvable");
    }

    return {
      service: service._id,
      employee: item.employee,
      name: service.name,
      price: service.price,
      duration: service.duration,
    };
  });

  const totalDuration = serviceSnapshot.reduce(
    (total, item) => total + item.duration,
    0,
  );

  const estimatedPrice = serviceSnapshot.reduce(
    (total, item) => total + item.price,
    0,
  );

  return { client, serviceSnapshot, totalDuration, estimatedPrice };
};

/**
 * Création rendez-vous
 */
export const createAppointment = async (data: CreateAppointmentData) => {
  if (isPastCalendarDate(data.date)) {
    throw new Error("Impossible de créer un rendez-vous dans le passé");
  }

  const { serviceSnapshot, totalDuration, estimatedPrice } =
    await buildAppointmentSnapshot({
      client: data.client,
      services: data.services,
    });

  const endTime = minutesToTime(timeToMinutes(data.startTime) + totalDuration);

  for (const item of serviceSnapshot) {
    await assertEmployeeAvailable(
      item.employee.toString(),
      data.date,
      data.startTime,
      endTime,
    );
  }

  return Appointment.create({
    client: data.client,

    services: serviceSnapshot,

    date: data.date,

    startTime: data.startTime,

    endTime,

    totalDuration,

    estimatedPrice,

    status: "pending",

    source: data.source ?? "admin",

    notes: data.notes,

    createdBy: data.createdBy,
  });
};

/**
 * Liste rendez-vous
 */
export const getAppointments = async (filter: AppointmentFilter = {}) => {
  const query: Record<string, unknown> = {};

  if (filter.status) query.status = filter.status;
  if (filter.employeeId) query["services.employee"] = filter.employeeId;
  if (filter.clientId) query.client = filter.clientId;

  if (filter.dateFrom || filter.dateTo) {
    query.date = {
      ...(filter.dateFrom && { $gte: filter.dateFrom }),
      ...(filter.dateTo && { $lte: filter.dateTo }),
    };
  }

  return Appointment.find(query)
    .populate("client", "firstName lastName phone")
    .populate("services.employee", "firstName lastName speciality")
    .sort({
      date: 1,
      startTime: 1,
    });
};

/**
 * Détail rendez-vous
 */
export const getAppointmentById = async (id: string) => {
  return Appointment.findById(id)
    .populate("client")
    .populate("services.employee");
};

/**
 * Modification (revalide horaires/conflit si le créneau change)
 */
export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentData,
) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return null;
  }

  const previousStatus = appointment.status;

  const scheduleChanged = Boolean(
    data.date || data.startTime || data.services,
  );

  let serviceSnapshot = appointment.services;
  let totalDuration = appointment.totalDuration;
  let estimatedPrice = appointment.estimatedPrice;

  if (data.services) {
    const snapshot = await buildAppointmentSnapshot({
      client: appointment.client.toString(),
      services: data.services,
    });

    serviceSnapshot = snapshot.serviceSnapshot as unknown as typeof appointment.services;
    totalDuration = snapshot.totalDuration;
    estimatedPrice = snapshot.estimatedPrice;
  }

  const date = data.date ?? appointment.date;
  const startTime = data.startTime ?? appointment.startTime;
  const endTime = minutesToTime(timeToMinutes(startTime) + totalDuration);

  if (scheduleChanged) {
    for (const item of serviceSnapshot) {
      await assertEmployeeAvailable(
        item.employee.toString(),
        date,
        startTime,
        endTime,
        id,
      );
    }
  }

  appointment.date = date;
  appointment.startTime = startTime;
  appointment.endTime = endTime;
  appointment.totalDuration = totalDuration;
  appointment.estimatedPrice = estimatedPrice;
  appointment.services = serviceSnapshot;
  appointment.updatedBy = data.updatedBy as any;

  if (data.notes !== undefined) appointment.notes = data.notes;
  if (data.noShowReason !== undefined)
    appointment.noShowReason = data.noShowReason;
  if (data.status) appointment.status = data.status;

  await appointment.save();

  if (data.status) {
    await applyClientReliabilityDelta(
      appointment.client,
      previousStatus,
      appointment.status,
    );
  }

  return appointment;
};

/**
 * Déplacement rapide (drag-and-drop calendrier) : ne change que date/heure
 */
export const rescheduleAppointment = async (
  id: string,
  data: { date: Date; startTime: string },
  userId: string,
) => {
  return updateAppointment(id, {
    date: data.date,
    startTime: data.startTime,
    updatedBy: userId,
  });
};

/**
 * Suppression définitive (bloquée si déjà facturé/terminé)
 */
export const deleteAppointment = async (id: string) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (
    ["waiting_payment", "paid", "completed"].includes(appointment.status)
  ) {
    throw new Error(
      "Impossible de supprimer un rendez-vous facturé ou terminé, annulez-le plutôt",
    );
  }

  await appointment.deleteOne();

  return appointment;
};

/**
 * Annulation
 */
export const cancelAppointment = async (id: string, userId: string) => {
  const existing = await Appointment.findById(id);

  if (!existing) {
    return null;
  }

  const previousStatus = existing.status;

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    {
      status: "cancelled",
      cancelledBy: userId,
      cancelledAt: new Date(),
    },
    {
      new: true,
    },
  );

  await applyClientReliabilityDelta(existing.client, previousStatus, "cancelled");

  return appointment;
};

/**
 * Fin prestation
 */
export const completeAppointment = async (id: string, userId: string) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (
    appointment.status !== "confirmed" &&
    appointment.status !== "in_progress"
  ) {
    throw new Error("Rendez-vous impossible à terminer");
  }

  const previousStatus = appointment.status;

  appointment.status = "completed";
  appointment.updatedBy = userId as any;

  await appointment.save();

  await applyClientReliabilityDelta(
    appointment.client,
    previousStatus,
    "completed",
  );

  const ticket = await Ticket.create({
    client: appointment.client,

    appointment: appointment._id,

    items: appointment.services.map((item) => ({
      service: item.service,
      employee: item.employee,
      finalPrice: item.price,
    })),

    total: appointment.estimatedPrice,

    status: "waiting_payment",

    createdBy: userId,
  });

  return {
    appointment,
    ticket,
  };
};

/**
 * Paiement
 */
export const payAppointment = async (id: string, userId: string) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new Error("Rendez-vous introuvable");
  }

  if (appointment.status !== "waiting_payment") {
    throw new Error("Rendez-vous non disponible pour paiement");
  }

  appointment.status = "paid";

  appointment.updatedBy = userId as any;

  await appointment.save();

  await applyClientReliabilityDelta(
    appointment.client,
    "waiting_payment",
    "paid",
  );

  return appointment;
};

export const getTodayAppointments = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return Appointment.find({ date: { $gte: start, $lte: end } })
    .populate("client", "firstName lastName phone")
    .populate("services.employee", "firstName lastName speciality")
    .sort({ startTime: 1 });
};

import Service from "../models/Service";
import User from "../models/User";
import Appointment from "../models/Appointment";
import Client from "../models/Client";
import { timeToMinutes, minutesToTime, isPastCalendarDate } from "../utils/time";
import { getEffectiveHours } from "./employeeSchedule.service";
import { assertEmployeeAvailable } from "./availability.service";

interface CreateOnlineAppointmentData {
  client: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };

  employee: string;

  services: string[];

  date: Date;

  startTime: string;
}

/**
 * Services disponibles publiquement
 */
export const getPublicServices = async () => {
  return Service.find({
    isActive: true,
    isDeleted: false,
    isBookable: true,
  })
    .select("name description price duration")
    .sort({
      name: 1,
    });
};

/**
 * Employés disponibles
 */
export const getPublicEmployees = async () => {
  return User.find({
    role: "employee",
    isActive: true,
  })
    .select("firstName lastName speciality")
    .sort({
      firstName: 1,
    });
};

/**
 * Disponibilité employé
 */
export const getAvailability = async (employeeId: string, date: Date) => {
  const hours = await getEffectiveHours(employeeId, date);

  if (!hours.isOpen || !hours.start || !hours.end) {
    return [];
  }

  const appointments = await Appointment.find({
    "services.employee": employeeId,

    date,

    status: {
      $in: ["pending", "confirmed", "in_progress"],
    },
  });

  const workingSlots: string[] = [];

  const startMinutes = timeToMinutes(hours.start);
  const endMinutes = timeToMinutes(hours.end);

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
    const time = minutesToTime(minutes);

    const occupied = appointments.some((appointment) => {
      const start = timeToMinutes(appointment.startTime);

      const end = timeToMinutes(appointment.endTime);

      const current = timeToMinutes(time);

      return current >= start && current < end;
    });

    if (!occupied) {
      workingSlots.push(time);
    }
  }

  return workingSlots;
};

/**
 * Création réservation online
 */
export const createOnlineAppointment = async (
  data: CreateOnlineAppointmentData,
) => {
  if (isPastCalendarDate(data.date)) {
    throw new Error("Impossible de réserver un rendez-vous dans le passé");
  }

  let client = await Client.findOne({
    phone: data.client.phone,

    isDeleted: false,
  });

  if (!client) {
    client = await Client.create({
      firstName: data.client.firstName,

      lastName: data.client.lastName,

      phone: data.client.phone,

      email: data.client.email,

      isActive: true,

      isDeleted: false,

      createdBy: process.env.SYSTEM_USER_ID,
    });
  }

  const employee = await User.findOne({
    _id: data.employee,

    role: "employee",

    isActive: true,
  });

  if (!employee) {
    throw new Error("Employé indisponible");
  }

  const services = await Service.find({
    _id: {
      $in: data.services,
    },

    isActive: true,

    isDeleted: false,
  });

  if (services.length !== data.services.length) {
    throw new Error("Service invalide");
  }

  const mismatchedService = services.find(
    (service) => service.speciality && service.speciality !== employee.speciality,
  );

  if (mismatchedService) {
    throw new Error(
      `Cet employé ne peut pas réaliser "${mismatchedService.name}" (spécialité requise : ${mismatchedService.speciality})`,
    );
  }

  const totalDuration = services.reduce(
    (total, service) => total + service.duration,
    0,
  );

  const estimatedPrice = services.reduce(
    (total, service) => total + service.price,
    0,
  );

  const endMinutes = timeToMinutes(data.startTime) + totalDuration;

  const endTime = minutesToTime(endMinutes);

  await assertEmployeeAvailable(data.employee, data.date, data.startTime, endTime);

  const appointment = await Appointment.create({
    client: client._id,

    services: services.map((service) => ({
      service: service._id,

      employee: data.employee,

      name: service.name,

      price: service.price,

      duration: service.duration,
    })),

    date: data.date,

    startTime: data.startTime,

    endTime,

    totalDuration,

    estimatedPrice,

    status: "pending",

    source: "online",
  });

  return appointment;
};

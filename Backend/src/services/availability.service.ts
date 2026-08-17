import Appointment from "../models/Appointment";
import { getEffectiveHours } from "./employeeSchedule.service";
import { timeToMinutes } from "../utils/time";

export type AvailabilityFailureReason =
  | "employee_unavailable"
  | "outside_hours"
  | "time_conflict";

export class AvailabilityError extends Error {
  reason: AvailabilityFailureReason;

  constructor(message: string, reason: AvailabilityFailureReason) {
    super(message);
    this.reason = reason;
  }
}

export const hasEmployeeConflict = async (
  employeeId: string,
  date: Date,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string,
): Promise<boolean> => {
  const conflict = await Appointment.findOne({
    "services.employee": employeeId,
    date,
    status: { $in: ["pending", "confirmed", "in_progress"] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    ...(excludeAppointmentId && { _id: { $ne: excludeAppointmentId } }),
  });

  return Boolean(conflict);
};

export const isWithinWorkingHours = async (
  employeeId: string,
  date: Date,
  startTime: string,
  endTime: string,
) => {
  const hours = await getEffectiveHours(employeeId, date);

  if (!hours.isOpen || !hours.start || !hours.end) {
    return false;
  }

  return (
    timeToMinutes(startTime) >= timeToMinutes(hours.start) &&
    timeToMinutes(endTime) <= timeToMinutes(hours.end)
  );
};

export const assertEmployeeAvailable = async (
  employeeId: string,
  date: Date,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string,
): Promise<void> => {
  const hours = await getEffectiveHours(employeeId, date);

  if (!hours.isOpen || !hours.start || !hours.end) {
    throw new AvailabilityError(
      "Employé indisponible ce jour-là",
      "employee_unavailable",
    );
  }

  const withinHours =
    timeToMinutes(startTime) >= timeToMinutes(hours.start) &&
    timeToMinutes(endTime) <= timeToMinutes(hours.end);

  if (!withinHours) {
    throw new AvailabilityError(
      "Créneau hors des horaires de travail de l'employé",
      "outside_hours",
    );
  }

  const conflict = await hasEmployeeConflict(
    employeeId,
    date,
    startTime,
    endTime,
    excludeAppointmentId,
  );

  if (conflict) {
    throw new AvailabilityError(
      "Employé déjà occupé sur ce créneau",
      "time_conflict",
    );
  }
};

import Appointment, { AppointmentStatus } from "../models/Appointment";
import AppointmentRecurrence, {
  RecurrenceFrequency,
} from "../models/AppointmentRecurrence";
import { timeToMinutes, minutesToTime, isPastCalendarDate } from "../utils/time";
import { assertEmployeeAvailable, AvailabilityError } from "./availability.service";
import { buildAppointmentSnapshot } from "./appointment.service";

const MAX_OCCURRENCES = 52;

const FREQUENCY_STEP_DAYS: Record<RecurrenceFrequency, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30, // approximation simple, cohérente avec le reste du domaine (pas de calendrier grégorien complexe)
};

export interface RecurrenceOptions {
  frequency: RecurrenceFrequency;
  count?: number;
  until?: Date;
}

/**
 * Génère les dates d'occurrence à partir de la première date, plafonné à 52
 * (borne dure de sécurité même si `until` est très éloigné)
 */
export const computeOccurrenceDates = (
  startDate: Date,
  options: RecurrenceOptions,
): Date[] => {
  const stepDays = FREQUENCY_STEP_DAYS[options.frequency];
  const dates: Date[] = [startDate];

  let current = startDate;

  while (dates.length < MAX_OCCURRENCES) {
    if (options.count && dates.length >= options.count) {
      break;
    }

    const next = new Date(current);
    next.setDate(next.getDate() + stepDays);

    if (options.until && next.getTime() > options.until.getTime()) {
      break;
    }

    dates.push(next);
    current = next;
  }

  return dates;
};

export type SkipReason =
  | "employee_unavailable"
  | "outside_hours"
  | "time_conflict"
  | "other";

interface CreateRecurringAppointmentData {
  client: string;
  services: { service: string; employee: string }[];
  date: Date;
  startTime: string;
  source?: "admin" | "cashier" | "online";
  notes?: string;
  createdBy: string;
  recurrence: RecurrenceOptions;
}

export const createRecurringAppointment = async (
  data: CreateRecurringAppointmentData,
) => {
  if (isPastCalendarDate(data.date)) {
    throw new Error("Impossible de créer un rendez-vous dans le passé");
  }

  const dates = computeOccurrenceDates(data.date, data.recurrence);

  const recurrenceGroup = await AppointmentRecurrence.create({
    frequency: data.recurrence.frequency,
    count: data.recurrence.count,
    until: data.recurrence.until,
    createdBy: data.createdBy,
  });

  const created: InstanceType<typeof Appointment>[] = [];
  const skipped: { date: Date; startTime: string; reason: SkipReason }[] = [];

  for (const occurrenceDate of dates) {
    try {
      const { serviceSnapshot, totalDuration, estimatedPrice } =
        await buildAppointmentSnapshot({
          client: data.client,
          services: data.services,
        });

      const endTime = minutesToTime(
        timeToMinutes(data.startTime) + totalDuration,
      );

      for (const item of serviceSnapshot) {
        await assertEmployeeAvailable(
          item.employee.toString(),
          occurrenceDate,
          data.startTime,
          endTime,
        );
      }

      const appointment = await Appointment.create({
        client: data.client,
        services: serviceSnapshot,
        date: occurrenceDate,
        startTime: data.startTime,
        endTime,
        totalDuration,
        estimatedPrice,
        status: "pending",
        source: data.source ?? "admin",
        notes: data.notes,
        createdBy: data.createdBy,
        recurrenceGroupId: recurrenceGroup._id,
      });

      created.push(appointment);
    } catch (error) {
      const reason: SkipReason =
        error instanceof AvailabilityError ? error.reason : "other";

      skipped.push({ date: occurrenceDate, startTime: data.startTime, reason });
    }
  }

  return {
    recurrenceGroup,
    created,
    skipped,
    totalRequested: dates.length,
    totalCreated: created.length,
    totalSkipped: skipped.length,
  };
};

export const getRecurrenceOccurrences = async (recurrenceGroupId: string) => {
  return Appointment.find({ recurrenceGroupId })
    .populate("client", "firstName lastName phone")
    .populate("services.employee", "firstName lastName speciality")
    .sort({ date: 1 });
};

const NON_CANCELLABLE_STATUSES: AppointmentStatus[] = [
  "completed",
  "waiting_payment",
  "paid",
  "cancelled",
  "no_show",
];

/**
 * Annule uniquement les occurrences futures encore modifiables
 * (ne touche jamais l'historique facturé/terminé)
 */
export const cancelRecurrenceSeries = async (
  recurrenceGroupId: string,
  userId: string,
  fromDate: Date = new Date(),
) => {
  const occurrences = await Appointment.find({
    recurrenceGroupId,
    date: { $gte: fromDate },
    status: { $nin: NON_CANCELLABLE_STATUSES },
  });

  const cancelled = [];

  for (const appointment of occurrences) {
    appointment.status = "cancelled";
    appointment.cancelledBy = userId as any;
    appointment.cancelledAt = new Date();

    await appointment.save();

    cancelled.push(appointment);
  }

  return cancelled;
};

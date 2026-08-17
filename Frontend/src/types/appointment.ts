// src/types/appointment.ts

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "waiting_payment"
  | "paid"
  | "cancelled"
  | "no_show";

export type AppointmentSource = "admin" | "cashier" | "online";

export type EmployeeSpeciality =
  | "Hair"
  | "Nails"
  | "Makeup"
  | "Massage"
  | "Reception";

export interface AppointmentClient {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AppointmentEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  speciality?: EmployeeSpeciality;
}

export interface AppointmentService {
  service: string;
  employee: string | AppointmentEmployee;
  name: string;
  price: number;
  duration: number;
}

export interface Appointment {
  _id: string;
  client: string | AppointmentClient;
  services: AppointmentService[];
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  estimatedPrice: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  notes?: string;
  noShowReason?: string;
  createdBy: string | AppointmentEmployee;
  recurrenceGroupId?: string;
  createdAt: string;
  updatedAt: string;
}

export type RecurrenceFrequency = "weekly" | "biweekly" | "monthly";

export interface RecurrencePayload {
  frequency: RecurrenceFrequency;
  count?: number;
  until?: string;
}

export type RecurrenceSkipReason =
  | "employee_unavailable"
  | "outside_hours"
  | "time_conflict"
  | "other";

export interface RecurrenceSkippedOccurrence {
  date: string;
  startTime: string;
  reason: RecurrenceSkipReason;
}

export interface CreateRecurringAppointmentResult {
  recurrenceGroup: { _id: string };
  created: Appointment[];
  skipped: RecurrenceSkippedOccurrence[];
  totalRequested: number;
  totalCreated: number;
  totalSkipped: number;
}

export interface CreateAppointmentService {
  service: string;
  employee: string;
  name: string;
  price: number;
  duration: number;
}

export interface CreateAppointmentPayload {
  client: string;
  createdBy: string;
  services: CreateAppointmentService[];
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  estimatedPrice: number;
  source: AppointmentSource;
  notes?: string;
}

export interface CreateRecurringAppointmentPayload {
  client: string;
  services: CreateAppointmentService[];
  date: string;
  startTime: string;
  source: AppointmentSource;
  notes?: string;
  recurrence: RecurrencePayload;
}

export interface UpdateAppointmentPayload {
  client?: string;
  services?: AppointmentService[];
  date?: string;
  startTime?: string;
  endTime?: string;
  totalDuration?: number;
  estimatedPrice?: number;
  status?: AppointmentStatus;
  source?: AppointmentSource;
  notes?: string;
  noShowReason?: string;
}

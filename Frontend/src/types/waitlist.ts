import type { AppointmentClient, AppointmentEmployee } from "./appointment";
import type { Service } from "./service";

export type WaitlistStatus = "waiting" | "matched" | "cancelled";

export interface WaitlistServiceEntry {
  service: string | Service;
  employee?: string | AppointmentEmployee;
}

export interface WaitlistEntry {
  _id: string;
  client: string | AppointmentClient;
  services: WaitlistServiceEntry[];
  desiredDateFrom: string;
  desiredDateTo?: string;
  notes?: string;
  status: WaitlistStatus;
  matchedAppointment?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWaitlistEntryPayload {
  client: string;
  services: { service: string; employee?: string }[];
  desiredDateFrom: string;
  desiredDateTo?: string;
  notes?: string;
}

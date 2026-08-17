import api from "./axios";

import type {
  WaitlistEntry,
  CreateWaitlistEntryPayload,
} from "../types/waitlist";

const API_URL = "/waitlist";

export const getWaitlist = async (params?: {
  status?: string;
}): Promise<WaitlistEntry[]> => {
  const { data } = await api.get(API_URL, { params });
  return data.entries ?? [];
};

export const createWaitlistEntry = async (
  payload: CreateWaitlistEntryPayload,
): Promise<WaitlistEntry> => {
  const { data } = await api.post(API_URL, payload);
  return data.entry;
};

export const getWaitlistMatches = async (params: {
  date: string;
  employee?: string;
  services: string[];
}): Promise<WaitlistEntry[]> => {
  const { data } = await api.get(`${API_URL}/matches`, {
    params: {
      date: params.date,
      employee: params.employee,
      services: params.services.join(","),
    },
  });
  return data.matches ?? [];
};

export const convertWaitlistEntry = async (
  id: string,
  payload: {
    services: { service: string; employee: string }[];
    date: string;
    startTime: string;
    source?: "admin" | "cashier" | "online";
    notes?: string;
  },
) => {
  const { data } = await api.post(`${API_URL}/${id}/convert`, payload);
  return data.appointment;
};

export const cancelWaitlistEntry = async (
  id: string,
): Promise<WaitlistEntry> => {
  const { data } = await api.patch(`${API_URL}/${id}/cancel`);
  return data.entry;
};

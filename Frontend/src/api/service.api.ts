import axios from "axios";

import type {
  CreateServicePayload,
  Service,
  UpdateServicePayload,
} from "../types/service";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run/api";

const serviceApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

serviceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const getServices = async (): Promise<Service[]> => {
  const { data } = await serviceApi.get("/services");

  return data.services ?? data;
};

export const getService = async (id: string): Promise<Service> => {
  const { data } = await serviceApi.get(`/services/${id}`);

  return data.service ?? data;
};

export const createService = async (
  payload: CreateServicePayload,
): Promise<Service> => {
  const { data } = await serviceApi.post("/services", payload);

  return data.service ?? data;
};

export const updateService = async (
  id: string,
  payload: UpdateServicePayload,
): Promise<Service> => {
  const { data } = await serviceApi.patch(`/services/${id}`, payload);

  return data.service ?? data;
};

export const deleteService = async (id: string): Promise<void> => {
  await serviceApi.delete(`/services/${id}`);
};

export const toggleServiceStatus = async (id: string): Promise<Service> => {
  const { data } = await serviceApi.patch(`/services/${id}/status`);

  return data.service ?? data;
};

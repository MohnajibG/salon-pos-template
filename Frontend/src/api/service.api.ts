import serviceApi from "./axios";

import type {
  CreateServicePayload,
  Service,
  UpdateServicePayload,
} from "../types/service";

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

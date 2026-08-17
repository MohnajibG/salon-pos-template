/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";

export const getClients = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await axios.get("/clients", {
    params,
  });

  return response.data;
};

export const createClient = async (data: any) => {
  const response = await axios.post("/clients", data);

  return response.data;
};

export const updateClient = async (id: string, data: any) => {
  const response = await axios.patch(`/clients/${id}`, data);

  return response.data;
};

export const deleteClient = async (id: string) => {
  const response = await axios.delete(`/clients/${id}`);

  return response.data;
};

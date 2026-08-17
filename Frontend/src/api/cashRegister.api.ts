import api from "./axios";

import type {
  CashRegister,
  OpenCashRegisterPayload,
  CloseCashRegisterPayload,
  AdminOpenCashRegisterPayload,
  FinalizeCashRegisterPayload,
} from "../types/cashRegister";

const API_URL = "/cash-register";

export const openCashRegister = async (
  payload: OpenCashRegisterPayload,
): Promise<CashRegister> => {
  const { data } = await api.post(`${API_URL}/open`, payload);
  return data.register;
};

export const closeCashRegister = async (
  payload: CloseCashRegisterPayload,
): Promise<CashRegister> => {
  const { data } = await api.patch(`${API_URL}/close`, payload);
  return data.register;
};

export const getCurrentCashRegister =
  async (): Promise<CashRegister | null> => {
    const { data } = await api.get(`${API_URL}/current`);
    return data.register;
  };

export const getCashRegisterHistory = async (
  params?: Record<string, string>,
): Promise<CashRegister[]> => {
  const { data } = await api.get(`${API_URL}/history`, { params });
  return data.history ?? [];
};

export const adminOpenCashRegister = async (
  payload: AdminOpenCashRegisterPayload,
): Promise<CashRegister> => {
  const { data } = await api.post(`${API_URL}/admin/open`, payload);
  return data.register;
};

export const adminCloseCashRegister = async (
  id: string,
  payload: CloseCashRegisterPayload,
): Promise<CashRegister> => {
  const { data } = await api.patch(`${API_URL}/${id}/admin-close`, payload);
  return data.register;
};

export const finalizeCashRegister = async (
  id: string,
  payload: FinalizeCashRegisterPayload,
): Promise<CashRegister> => {
  const { data } = await api.patch(`${API_URL}/${id}/finalize`, payload);
  return data.register;
};

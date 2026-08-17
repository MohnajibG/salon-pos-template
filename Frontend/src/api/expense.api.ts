import api from "./axios";

import type { Expense, CreateExpensePayload } from "../types/expense";

const API_URL = "/expenses";

export const getExpenses = async (params?: {
  from?: string;
  to?: string;
  type?: string;
}): Promise<Expense[]> => {
  const { data } = await api.get(API_URL, { params });
  return data.expenses ?? [];
};

export const createExpense = async (
  payload: CreateExpensePayload,
): Promise<Expense> => {
  const { data } = await api.post(API_URL, payload);
  return data.expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

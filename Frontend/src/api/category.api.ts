import axios from "axios";
import type { Category } from "../types/category";

const API_URL = "https://site--ankelk--dnxhn8mdblq5.code.run/api";

const categoryApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

categoryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await categoryApi.get("/categories");

  return data.categories ?? [];
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
}): Promise<Category> => {
  const { data } = await categoryApi.post("/categories", payload);

  return data.category;
};

export const updateCategory = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
  },
): Promise<Category> => {
  const { data } = await categoryApi.patch(`/categories/${id}`, payload);

  return data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await categoryApi.delete(`/categories/${id}`);
};

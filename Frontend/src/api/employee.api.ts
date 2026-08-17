import api from "./axios";

import type {
  Employee,
  EmployeeApiResponse,
  CreateEmployeeResponse,
  EmployeeForm,
} from "../types/employee";

const API_URL = "/employees";

interface GetEmployeesParams {
  search?: string;
  role?: string;
  isActive?: boolean;
  limit?: number;
}

export const getEmployees = async (
  params?: GetEmployeesParams,
): Promise<Employee[]> => {
  const { data } = await api.get<EmployeeApiResponse>(API_URL, {
    params,
  });

  return data.employees ?? [];
};

export const createEmployee = async (
  form: EmployeeForm,
): Promise<CreateEmployeeResponse> => {
  const { data } = await api.post(API_URL, form);

  return data;
};

export const updateEmployee = async (
  id: string,
  payload: Partial<EmployeeForm>,
): Promise<Employee> => {
  const { data } = await api.patch(`${API_URL}/${id}`, payload);

  return data.employee;
};

export const updateEmployeeStatus = async (
  id: string,
  isActive: boolean,
): Promise<Employee> => {
  const { data } = await api.patch(`${API_URL}/${id}/status`, {
    isActive,
  });

  return data.employee;
};

export const deleteEmployee = async (id: string): Promise<Employee> => {
  const { data } = await api.delete(`${API_URL}/${id}`);

  return data.employee;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const { data } = await api.get(`${API_URL}/${id}`);

  return data.employee;
};

export const getMyEmployeeProfile = async (): Promise<Employee> => {
  const { data } = await api.get(`${API_URL}/me`);

  return data.employee;
};

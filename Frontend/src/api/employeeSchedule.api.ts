import api from "./axios";

import type {
  DayOfWeek,
  DayHours,
  EmployeeSchedule,
} from "../types/employeeSchedule";

const API_URL = "/employees";

export const getSchedule = async (
  employeeId: string,
): Promise<EmployeeSchedule> => {
  const { data } = await api.get(`${API_URL}/${employeeId}/schedule`);
  return data.schedule;
};

export const updateWeeklyHours = async (
  employeeId: string,
  weeklyHours: Record<DayOfWeek, DayHours>,
): Promise<EmployeeSchedule> => {
  const { data } = await api.put(`${API_URL}/${employeeId}/schedule`, {
    weeklyHours,
  });
  return data.schedule;
};

export const addException = async (
  employeeId: string,
  exception: {
    date: string;
    isOff: boolean;
    start?: string;
    end?: string;
    reason?: string;
  },
): Promise<EmployeeSchedule> => {
  const { data } = await api.post(
    `${API_URL}/${employeeId}/schedule/exceptions`,
    exception,
  );
  return data.schedule;
};

export const removeException = async (
  employeeId: string,
  exceptionId: string,
): Promise<EmployeeSchedule> => {
  const { data } = await api.delete(
    `${API_URL}/${employeeId}/schedule/exceptions/${exceptionId}`,
  );
  return data.schedule;
};

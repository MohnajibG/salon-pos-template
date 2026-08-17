import { useMemo } from "react";
import { useAuth } from "./useAuth";
import type { Appointment } from "../types/appointment";

const useAppointments = (appointments: Appointment[]) => {
  const { user } = useAuth();

  const role = user?.role;

  const isAdmin = role === "admin";
  const isCashier = role === "cashier";
  const isEmployee = role === "employee";

  const canViewAll = isAdmin || isCashier;

  const visibleAppointments = useMemo(() => {
    if (canViewAll) {
      return appointments;
    }

    return appointments.filter((appointment) =>
      appointment.services.some((service) => {
        if (typeof service.employee === "string") {
          return service.employee === user?._id;
        }

        return service.employee?._id === user?._id;
      }),
    );
  }, [appointments, canViewAll, user]);

  return {
    appointments: visibleAppointments,

    user,

    isAdmin,
    isCashier,
    isEmployee,

    permissions: {
      viewAll: canViewAll,

      create: true,

      update: true,

      delete: true,
    },
  };
};

export default useAppointments;

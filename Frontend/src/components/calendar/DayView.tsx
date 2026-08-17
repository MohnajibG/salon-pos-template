import { useMemo } from "react";

import type { Appointment } from "../../types/appointment";
import type { Employee } from "../../types/employee";
import TimeGrid from "./TimeGrid";

interface DayViewProps {
  appointments: Appointment[];
  employees: Employee[];
  employeeFilter?: string;
  readOnly?: boolean;
  onSelectAppointment?: (appointment: Appointment) => void;
  onSelectEmptySlot?: (employeeId: string, startTime: string) => void;
  onReschedule: (
    appointment: Appointment,
    columnKey: string,
    newStartTime: string,
  ) => void;
}

const employeeIdOf = (appointment: Appointment): string | undefined => {
  const employee = appointment.services[0]?.employee;
  return typeof employee === "string" ? employee : employee?._id;
};

const DayView = ({
  appointments,
  employees,
  employeeFilter,
  readOnly,
  onSelectAppointment,
  onSelectEmptySlot,
  onReschedule,
}: DayViewProps) => {
  const columns = useMemo(() => {
    const visibleEmployees = employeeFilter
      ? employees.filter((employee) => employee._id === employeeFilter)
      : employees.filter((employee) => employee.role === "employee");

    if (visibleEmployees.length === 0) {
      return [{ key: "none", label: "Aucun employé" }];
    }

    return visibleEmployees.map((employee) => ({
      key: employee._id,
      label: `${employee.firstName} ${employee.lastName}`,
    }));
  }, [employees, employeeFilter]);

  return (
    <TimeGrid
      columns={columns}
      startHour={8}
      endHour={20}
      appointments={appointments}
      getColumnKey={(appointment) => employeeIdOf(appointment) ?? "none"}
      readOnly={readOnly}
      onSelectAppointment={onSelectAppointment}
      onSelectEmptySlot={onSelectEmptySlot}
      onReschedule={onReschedule}
    />
  );
};

export default DayView;

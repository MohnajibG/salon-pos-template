import { useMemo } from "react";

import type { Appointment } from "../../types/appointment";
import TimeGrid from "./TimeGrid";
import { addDays, dayLabel } from "./dateUtils";

interface WeekViewProps {
  weekStartKey: string;
  appointments: Appointment[];
  readOnly?: boolean;
  onSelectAppointment?: (appointment: Appointment) => void;
  onSelectEmptySlot?: (dateKey: string, startTime: string) => void;
  onReschedule: (
    appointment: Appointment,
    columnKey: string,
    newStartTime: string,
  ) => void;
}

const WeekView = ({
  weekStartKey,
  appointments,
  readOnly,
  onSelectAppointment,
  onSelectEmptySlot,
  onReschedule,
}: WeekViewProps) => {
  const columns = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const key = addDays(weekStartKey, index);
        return { key, label: dayLabel(key) };
      }),
    [weekStartKey],
  );

  return (
    <TimeGrid
      columns={columns}
      startHour={8}
      endHour={20}
      appointments={appointments}
      getColumnKey={(appointment) => appointment.date.slice(0, 10)}
      readOnly={readOnly}
      onSelectAppointment={onSelectAppointment}
      onSelectEmptySlot={onSelectEmptySlot}
      onReschedule={onReschedule}
    />
  );
};

export default WeekView;

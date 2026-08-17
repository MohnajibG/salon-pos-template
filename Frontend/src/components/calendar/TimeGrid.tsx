import { useMemo, useRef } from "react";
import type { PanInfo } from "framer-motion";

import type { Appointment } from "../../types/appointment";
import { assignLanes } from "./layout";
import { minutesToTime, timeToMinutes } from "./dateUtils";
import AppointmentBlock from "./AppointmentBlock";

export interface CalendarColumn {
  key: string;
  label: string;
}

interface TimeGridProps {
  columns: CalendarColumn[];
  startHour: number;
  endHour: number;
  pxPerMinute?: number;
  snapMinutes?: number;
  appointments: Appointment[];
  getColumnKey: (appointment: Appointment) => string | undefined;
  readOnly?: boolean;
  onSelectAppointment?: (appointment: Appointment) => void;
  onSelectEmptySlot?: (columnKey: string, startTime: string) => void;
  onReschedule: (
    appointment: Appointment,
    columnKey: string,
    newStartTime: string,
  ) => void;
}

const TimeGrid = ({
  columns,
  startHour,
  endHour,
  pxPerMinute = 1.2,
  snapMinutes = 15,
  appointments,
  getColumnKey,
  readOnly = false,
  onSelectAppointment,
  onSelectEmptySlot,
  onReschedule,
}: TimeGridProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  const totalMinutes = (endHour - startHour) * 60;
  const gridHeight = totalMinutes * pxPerMinute;

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = startHour; h <= endHour; h++) list.push(h);
    return list;
  }, [startHour, endHour]);

  const columnWidthPercent = 100 / Math.max(columns.length, 1);
  const minColumnWidth = 120;
  const contentMinWidth = columns.length * minColumnWidth;

  const positionedByColumn = useMemo(() => {
    const map = new Map<string, ReturnType<typeof assignLanes>>();

    for (const column of columns) {
      const items = appointments.filter(
        (appointment) => getColumnKey(appointment) === column.key,
      );
      map.set(column.key, assignLanes(items));
    }

    return map;
  }, [columns, appointments, getColumnKey]);

  const pointToSlot = (clientX: number, clientY: number) => {
    const body = bodyRef.current;
    if (!body || columns.length === 0) return null;

    const rect = body.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top + body.scrollTop;

    const columnIndex = Math.min(
      Math.max(Math.floor((relativeX / rect.width) * columns.length), 0),
      columns.length - 1,
    );

    const column = columns[columnIndex];
    if (!column) return null;

    const rawMinutes = startHour * 60 + relativeY / pxPerMinute;
    const snapped = Math.round(rawMinutes / snapMinutes) * snapMinutes;
    const clamped = Math.min(Math.max(snapped, startHour * 60), endHour * 60);

    return { column, startTime: minutesToTime(clamped) };
  };

  const handleDragEnd = (appointment: Appointment, info: PanInfo) => {
    const slot = pointToSlot(info.point.x, info.point.y);
    if (!slot) return;

    if (
      slot.column.key === getColumnKey(appointment) &&
      slot.startTime === appointment.startTime
    ) {
      return;
    }

    onReschedule(appointment, slot.column.key, slot.startTime);
  };

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!onSelectEmptySlot || readOnly) return;
    if (event.target !== event.currentTarget) return;

    const slot = pointToSlot(event.clientX, event.clientY);
    if (!slot) return;

    onSelectEmptySlot(slot.column.key, slot.startTime);
  };

  return (
    <div className="flex w-full">
      <div className="w-16 flex-shrink-0 pt-9">
        {hours.map((hour) => (
          <div
            key={hour}
            style={{ height: 60 * pxPerMinute }}
            className="relative -top-2.5 pr-2 text-right text-xs text-stone-400"
          >
            {hour.toString().padStart(2, "0")}:00
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-x-auto">
        <div style={{ minWidth: contentMinWidth }}>
          <div className="flex border-b border-(--border) pb-2">
            {columns.map((column) => (
              <div
                key={column.key}
                style={{ width: `${columnWidthPercent}%` }}
                className="truncate px-2 text-center text-sm font-semibold"
              >
                {column.label}
              </div>
            ))}
          </div>

          <div
            ref={bodyRef}
            onClick={handleBackgroundClick}
            className={`relative border-t border-(--border) ${
              onSelectEmptySlot && !readOnly ? "cursor-cell" : ""
            }`}
            style={{ height: gridHeight }}
          >
            {hours.map((hour, index) => (
              <div
                key={hour}
                className="pointer-events-none absolute left-0 w-full border-t border-(--border)/50"
                style={{ top: index * 60 * pxPerMinute }}
              />
            ))}

            {columns.map((column, columnIndex) => (
              <div
                key={column.key}
                className="pointer-events-none absolute top-0 h-full border-r border-(--border)/40"
                style={{
                  left: `${columnIndex * columnWidthPercent}%`,
                  width: `${columnWidthPercent}%`,
                }}
              />
            ))}

            {columns.flatMap((column, columnIndex) => {
              const items = positionedByColumn.get(column.key) ?? [];

              return items.map(({ appointment, lane, laneCount }) => {
                const top =
                  (timeToMinutes(appointment.startTime) - startHour * 60) *
                  pxPerMinute;
                const height = Math.max(
                  appointment.totalDuration * pxPerMinute,
                  18,
                );

                const laneWidth = columnWidthPercent / laneCount;
                const left =
                  columnIndex * columnWidthPercent + lane * laneWidth;

                return (
                  <AppointmentBlock
                    key={appointment._id}
                    appointment={appointment}
                    readOnly={readOnly}
                    dragConstraintsRef={bodyRef}
                    onClick={() => onSelectAppointment?.(appointment)}
                    onDragEnd={(_event, info) =>
                      handleDragEnd(appointment, info)
                    }
                    style={{
                      position: "absolute",
                      top,
                      height,
                      left: `${left}%`,
                      width: `${laneWidth}%`,
                    }}
                  />
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeGrid;

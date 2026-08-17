import { useMemo } from "react";

import type { Appointment } from "../../types/appointment";
import { addDays, fromDateKey, startOfMonth, startOfWeek } from "./dateUtils";

interface MonthViewProps {
  monthAnchorKey: string;
  appointments: Appointment[];
  onSelectDay: (dateKey: string) => void;
}

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MonthView = ({ monthAnchorKey, appointments, onSelectDay }: MonthViewProps) => {
  const monthStart = startOfMonth(monthAnchorKey);
  const monthNumber = fromDateKey(monthStart).getUTCMonth();

  const gridStart = startOfWeek(monthStart);

  const cells = useMemo(() => {
    const days: string[] = [];
    let cursor = gridStart;

    for (let i = 0; i < 42; i++) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }

    return days;
  }, [gridStart]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();

    for (const appointment of appointments) {
      const key = appointment.date.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(appointment);
      map.set(key, list);
    }

    for (const list of map.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return map;
  }, [appointments]);

  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border)">
      <div className="flex border-b border-(--border) bg-(--cream)">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="w-[14.2857%] p-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-500"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap">
        {cells.map((dateKey) => {
          const inMonth = fromDateKey(dateKey).getUTCMonth() === monthNumber;
          const dayAppointments = appointmentsByDate.get(dateKey) ?? [];
          const visible = dayAppointments.slice(0, 3);
          const extra = dayAppointments.length - visible.length;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDay(dateKey)}
              className={`min-h-28 w-[14.2857%] border-b border-r border-(--border) p-2 text-left align-top last:border-r-0 ${
                inMonth ? "bg-white" : "bg-stone-50 text-stone-400"
              } ${dateKey === todayKey ? "ring-2 ring-inset ring-(--black)" : ""}`}
            >
              <span className="text-xs font-semibold">
                {Number(dateKey.slice(8, 10))}
              </span>

              <div className="mt-1 flex flex-col gap-1">
                {visible.map((appointment) => (
                  <span
                    key={appointment._id}
                    className="truncate rounded bg-(--cream) px-1.5 py-0.5 text-[10px] text-(--black)"
                  >
                    {appointment.startTime}{" "}
                    {typeof appointment.client !== "string" &&
                      appointment.client.firstName}
                  </span>
                ))}

                {extra > 0 && (
                  <span className="text-[10px] text-stone-500">
                    +{extra} autres
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;

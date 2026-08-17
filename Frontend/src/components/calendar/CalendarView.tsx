import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import useCalendarAppointments, {
  type CalendarViewMode,
} from "../../hooks/useCalendarAppointments";
import { rescheduleAppointment } from "../../api/appointment.api";
import { getEmployees } from "../../api/employee.api";

import type { Appointment } from "../../types/appointment";
import type { Employee } from "../../types/employee";

import AppointmentDetailPanel from "../appointments/AppointmentDetailPanel";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import {
  addDays,
  fromDateKey,
  monthLabel,
  startOfWeek,
  toDateKey,
} from "./dateUtils";

interface CalendarViewProps {
  canEdit: boolean;
  onCreateRequest?: (prefill: {
    date: string;
    startTime: string;
    employeeId?: string;
  }) => void;
}

const VIEW_LABELS: Record<CalendarViewMode, string> = {
  day: "Jour",
  week: "Semaine",
  month: "Mois",
};

const CalendarView = ({ canEdit, onCreateRequest }: CalendarViewProps) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [currentDateKey, setCurrentDateKey] = useState(() =>
    toDateKey(new Date()),
  );
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch((err) => console.error("[CalendarView] getEmployees:", err));
  }, []);

  const { appointments, setAppointments, loading, error, refresh } =
    useCalendarAppointments({
      viewMode,
      currentDateKey,
      employeeId: employeeFilter || undefined,
    });

  const navigate = (direction: 1 | -1) => {
    if (viewMode === "day") {
      setCurrentDateKey((key) => addDays(key, direction));
    } else if (viewMode === "week") {
      setCurrentDateKey((key) => addDays(key, direction * 7));
    } else {
      const date = fromDateKey(currentDateKey);
      date.setUTCMonth(date.getUTCMonth() + direction);
      setCurrentDateKey(toDateKey(date));
    }
  };

  const handleReschedule = async (
    appointment: Appointment,
    columnKey: string,
    newStartTime: string,
  ) => {
    const previous = appointments;

    const newDate =
      viewMode === "week" ? columnKey : appointment.date.slice(0, 10);

    const newEndTime = (() => {
      const [h, m] = newStartTime.split(":").map(Number);
      const total = h * 60 + m + appointment.totalDuration;
      return `${Math.floor(total / 60)
        .toString()
        .padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}`;
    })();

    setAppointments((current) =>
      current.map((item) =>
        item._id === appointment._id
          ? {
              ...item,
              date: `${newDate}T00:00:00.000Z`,
              startTime: newStartTime,
              endTime: newEndTime,
            }
          : item,
      ),
    );

    try {
      await rescheduleAppointment(appointment._id, {
        date: newDate,
        startTime: newStartTime,
      });

      refresh();
    } catch (err) {
      setAppointments(previous);

      const message =
        err instanceof AxiosError
          ? (err.response?.data?.message ?? "Impossible de déplacer ce rendez-vous")
          : "Impossible de déplacer ce rendez-vous";

      toast.error(message);
    }
  };

  const handleSelectEmptySlot = (columnKey: string, startTime: string) => {
    if (!onCreateRequest) return;

    if (viewMode === "day") {
      onCreateRequest({
        date: currentDateKey,
        startTime,
        employeeId: columnKey !== "none" ? columnKey : undefined,
      });
    } else {
      onCreateRequest({
        date: columnKey,
        startTime,
        employeeId: employeeFilter || undefined,
      });
    }
  };

  const weekStartKey = startOfWeek(currentDateKey);

  const title =
    viewMode === "month"
      ? monthLabel(currentDateKey)
      : viewMode === "week"
        ? `Semaine du ${weekStartKey.slice(8, 10)}/${weekStartKey.slice(5, 7)}`
        : currentDateKey;

  return (
    <div className="rounded-3xl border border-(--border) bg-white p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border)"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => setCurrentDateKey(toDateKey(new Date()))}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm"
          >
            Aujourd'hui
          </button>

          <button
            type="button"
            onClick={() => navigate(1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border)"
          >
            <ChevronRight size={18} />
          </button>

          <span className="ml-2 text-sm font-semibold capitalize">{title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={employeeFilter}
            onChange={(event) => setEmployeeFilter(event.target.value)}
            className="h-10 w-full rounded-xl border border-(--border) px-3 text-sm sm:w-auto"
          >
            <option value="">Tous les employés</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>

          <div className="flex rounded-xl border border-(--border) p-1">
            {(Object.keys(VIEW_LABELS) as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  viewMode === mode
                    ? "bg-(--black) text-(--cream)"
                    : "text-stone-600"
                }`}
              >
                {VIEW_LABELS[mode]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-stone-500">Chargement...</div>
      ) : viewMode === "day" ? (
        <DayView
          appointments={appointments}
          employees={employees}
          employeeFilter={employeeFilter || undefined}
          readOnly={!canEdit}
          onSelectAppointment={setSelectedAppointment}
          onSelectEmptySlot={handleSelectEmptySlot}
          onReschedule={handleReschedule}
        />
      ) : viewMode === "week" ? (
        <WeekView
          weekStartKey={weekStartKey}
          appointments={appointments}
          readOnly={!canEdit}
          onSelectAppointment={setSelectedAppointment}
          onSelectEmptySlot={handleSelectEmptySlot}
          onReschedule={handleReschedule}
        />
      ) : (
        <MonthView
          monthAnchorKey={currentDateKey}
          appointments={appointments}
          onSelectDay={(dateKey) => {
            setCurrentDateKey(dateKey);
            setViewMode("day");
          }}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailPanel
          appointment={selectedAppointment}
          canEdit={canEdit}
          onClose={() => setSelectedAppointment(null)}
          onChanged={refresh}
        />
      )}
    </div>
  );
};

export default CalendarView;

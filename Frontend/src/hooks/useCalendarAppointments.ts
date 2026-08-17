/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAppointments } from "../api/appointment.api";
import type { Appointment } from "../types/appointment";

import {
  addDays,
  daysInMonth,
  startOfMonth,
  startOfWeek,
} from "../components/calendar/dateUtils";

export type CalendarViewMode = "day" | "week" | "month";

interface UseCalendarAppointmentsParams {
  viewMode: CalendarViewMode;
  currentDateKey: string;
  employeeId?: string;
}

const useCalendarAppointments = ({
  viewMode,
  currentDateKey,
  employeeId,
}: UseCalendarAppointmentsParams) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { dateFrom, dateTo } = useMemo(() => {
    if (viewMode === "day") {
      return { dateFrom: currentDateKey, dateTo: currentDateKey };
    }

    if (viewMode === "week") {
      const start = startOfWeek(currentDateKey);
      return { dateFrom: start, dateTo: addDays(start, 6) };
    }

    const start = startOfMonth(currentDateKey);
    return { dateFrom: start, dateTo: addDays(start, daysInMonth(start) - 1) };
  }, [viewMode, currentDateKey]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAppointments({
        dateFrom,
        dateTo,
        ...(employeeId && { employeeId }),
      });

      setAppointments(data);
    } catch (err) {
      console.error("[Calendar] getAppointments:", err);
      setError("Impossible de charger les rendez-vous");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, employeeId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { appointments, setAppointments, loading, error, refresh };
};

export default useCalendarAppointments;

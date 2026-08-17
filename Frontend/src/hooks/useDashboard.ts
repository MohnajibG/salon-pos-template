import { useCallback, useEffect, useState } from "react";

import {
  getAdminDashboard,
  type DashboardData,
  type DashboardPeriod,
} from "../api/dashboard.api";

const useDashboard = () => {
  const [period, setPeriod] = useState<DashboardPeriod>("month");

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminDashboard(
        period === "custom"
          ? {
              period,
              startDate,
              endDate,
            }
          : {
              period,
              date,
            },
      );

      setData(result);
    } catch (err) {
      console.error("[Dashboard] load:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger le dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, [period, date, startDate, endDate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    loading,
    error,

    period,
    setPeriod,

    date,
    setDate,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    refresh: loadDashboard,
  };
};

export default useDashboard;

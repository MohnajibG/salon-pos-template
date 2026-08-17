import { CalendarCheck, CalendarX, TrendingUp, XCircle } from "lucide-react";

import type { DashboardData } from "../../api/dashboard.api";
import KpiCard from "./KpiCard";

interface AppointmentStatsProps {
  data: DashboardData;
}

export default function AppointmentStats({ data }: AppointmentStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        icon={CalendarCheck}
        title="Rendez-vous"
        value={String(data.appointments.total)}
      />

      <KpiCard
        icon={TrendingUp}
        title="Taux de conversion"
        value={`${data.appointments.conversionRate}%`}
      />

      <KpiCard
        icon={CalendarX}
        title="Taux de no-show"
        value={`${data.appointments.noShowRate}%`}
        danger={data.appointments.noShowRate > 10}
      />

      <KpiCard
        icon={XCircle}
        title="Annulés"
        value={String(data.appointments.cancelled)}
      />
    </section>
  );
}

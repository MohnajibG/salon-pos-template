import {
  HandCoins,
  Receipt,
  ShoppingBag,
  XCircle,
  Users,
  UserPlus,
  Repeat,
  UserCog,
} from "lucide-react";

import type { DashboardData } from "../../api/dashboard.api";
import KpiCard from "./KpiCard";
import { formatMoney as money } from "../../config/currency";

interface DashboardKpisProps {
  data: DashboardData;
}

export default function DashboardKpis({ data }: DashboardKpisProps) {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={HandCoins}
          title="Chiffre d'affaires"
          value={money(data.sales.current.revenue)}
          change={data.sales.change.revenue}
        />

        <KpiCard
          icon={Receipt}
          title="Tickets"
          value={String(data.sales.current.tickets)}
          change={data.sales.change.tickets}
        />

        <KpiCard
          icon={ShoppingBag}
          title="Panier moyen"
          value={money(data.averageBasket)}
        />

        <KpiCard
          icon={XCircle}
          title="Taux d'annulation"
          value={`${data.cancellation.rate}%`}
          danger={data.cancellation.rate > 10}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Users}
          title="Clients actifs"
          value={String(data.clients.total)}
        />

        <KpiCard
          icon={UserPlus}
          title="Nouveaux clients"
          value={String(data.clients.new)}
        />

        <KpiCard
          icon={Repeat}
          title="Clients fidèles"
          value={String(data.clients.returning)}
        />

        <KpiCard
          icon={UserCog}
          title="Employés"
          value={String(data.employees.total)}
        />
      </section>
    </>
  );
}

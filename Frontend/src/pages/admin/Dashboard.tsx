/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CalendarCheck,
  ClipboardList,
  HandCoins,
  Receipt,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  getAdminDashboard,
  type DashboardData,
  type DashboardPeriod,
} from "../../api/dashboard.api";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";

const periods: { value: DashboardPeriod; label: string }[] = [
  { value: "day", label: "Aujourd'hui" },
  { value: "week", label: "Semaine" },
  { value: "month", label: "Mois" },
  { value: "year", label: "Année" },
];

const paymentLabels: Record<string, string> = {
  cash: "Espèces",
  card: "Carte",
  transfer: "Virement",
};

const expenseLabels: Record<string, string> = {
  variable: "Variables",
  "semi-variable": "Semi-variables",
};

const Dashboard = () => {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (p: DashboardPeriod) => {
    try {
      setLoading(true);
      setError("");
      const result = await getAdminDashboard({ period: p });
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger le dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(period);
  }, [period, loadDashboard]);

  if (loading) return <LoadingState label="Chargement du dashboard..." />;

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 text-red-600">{error}</div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="Aucune donnée disponible"
        description="Les statistiques apparaîtront ici dès la première vente."
      />
    );
  }

  const maxServiceRevenue = Math.max(
    ...data.popularServices.map((s) => s.revenue),
    1,
  );
  const maxEmployeeRevenue = Math.max(
    ...data.topEmployees.map((e) => e.revenue),
    1,
  );
  const maxCategoryRevenue = Math.max(
    ...data.categoryBreakdown.map((c) => c.revenue),
    1,
  );
  const maxEvolution = Math.max(...data.evolution.map((e) => e.revenue), 1);
  const maxExpenseTotal = Math.max(
    ...(data.expenses?.breakdown ?? []).map((e) => e.total),
    1,
  );
  const totalPayments =
    data.paymentBreakdown.reduce((s, p) => s + p.revenue, 0) || 1;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Admin"
        title="Vue d'ensemble"
        description={`Période du ${new Date(data.range.start).toLocaleDateString("fr-FR")} au ${new Date(data.range.end).toLocaleDateString("fr-FR")}`}
        icon={<TrendingUp size={24} />}
        action={
          <div className="flex gap-1 rounded-2xl border border-(--border) bg-white p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  period === p.value
                    ? "bg-(--black) text-(--cream)"
                    : "text-(--muted) hover:bg-(--surface)"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      <section className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={HandCoins}
            title="Chiffre d'affaires"
            value={`${data.sales.current.revenue.toLocaleString("fr-FR")} DA`}
            trend={{ value: Math.round(data.sales.change.revenue) }}
            accent="black"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Receipt}
            title="Tickets"
            value={data.sales.current.tickets}
            trend={{ value: Math.round(data.sales.change.tickets) }}
            accent="gold"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={ShoppingBag}
            title="Panier moyen"
            value={`${Math.round(data.averageBasket).toLocaleString("fr-FR")} DA`}
            accent="info"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Users}
            title="Clients"
            value={data.clients.total}
            footer={`${data.clients.new} nouvelles • ${data.clients.returning} fidèles`}
            accent="success"
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={UserCog}
            title="Employés"
            value={data.employees.total}
            accent="gold"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={CalendarCheck}
            title="Taux de conversion RDV"
            value={`${Math.round(data.appointments.conversionRate)}%`}
            footer={`${data.appointments.completed}/${data.appointments.total} terminés`}
            accent="success"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={XCircle}
            title="No-show"
            value={`${Math.round(data.appointments.noShowRate)}%`}
            footer={`${data.appointments.noShow} absences`}
            accent="danger"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={TrendingDown}
            title="Annulations"
            value={`${Math.round(data.cancellation.rate)}%`}
            footer={`${data.cancellation.cancelledValue.toLocaleString("fr-FR")} DA perdus`}
            accent="danger"
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-6">
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(66.667%-8px)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-(--black)">
              Évolution du chiffre d'affaires
            </h2>
            <TrendingUp size={20} className="text-(--brown)" />
          </div>

          {data.evolution.length ? (
            <div className="mt-6 flex h-48 items-end gap-2">
              {data.evolution.map((point) => (
                <div
                  key={point._id}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-40 w-full items-end overflow-hidden rounded-lg bg-(--surface)">
                    <div
                      className="w-full rounded-t-lg bg-(--black) transition-all"
                      style={{
                        height: `${(point.revenue / maxEvolution) * 100}%`,
                      }}
                      title={`${point.revenue} DA`}
                    />
                  </div>
                  <span className="text-[10px] text-(--muted)">
                    {point._id.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-(--muted)">
              Pas assez de données pour cette période.
            </p>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.005 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(33.333%-16px)]"
        >
          <div className="mb-5 flex items-center gap-2">
            <Wallet size={20} className="text-(--brown)" />
            <h2 className="font-semibold text-(--black)">Modes de paiement</h2>
          </div>

          <div className="space-y-4">
            {data.paymentBreakdown.length ? (
              data.paymentBreakdown.map((p) => (
                <div key={p._id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-(--black)">
                      {paymentLabels[p._id] ?? p._id}
                    </span>
                    <strong>{p.revenue.toLocaleString("fr-FR")} DA</strong>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--surface)">
                    <div
                      className="h-full rounded-full bg-(--champagne)"
                      style={{ width: `${(p.revenue / totalPayments) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--muted)">
                Aucun paiement enregistré
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.005 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(33.333%-16px)]"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={20} className="text-(--brown)" />
              <h2 className="font-semibold text-(--black)">
                Charges variables & semi-variables
              </h2>
            </div>

            <strong className="text-(--black)">
              {(data.expenses?.total ?? 0).toLocaleString("fr-FR")} DA
            </strong>
          </div>

          <div className="space-y-4">
            {data.expenses?.breakdown.length ? (
              data.expenses.breakdown.map((e) => (
                <div key={e._id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-(--black)">
                      {expenseLabels[e._id] ?? e._id}
                    </span>
                    <strong>
                      {e.total.toLocaleString("fr-FR")} DA
                      <span className="ml-2 font-normal text-(--muted)">
                        ({e.count})
                      </span>
                    </strong>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--surface)">
                    <div
                      className="h-full rounded-full bg-red-400"
                      style={{
                        width: `${(e.total / maxExpenseTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--muted)">
                Aucune charge enregistrée
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.005 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(33.333%-16px)]"
        >
          <div className="mb-5 flex items-center gap-2">
            <ShoppingBag size={20} className="text-(--brown)" />
            <h2 className="font-semibold text-(--black)">
              Services populaires
            </h2>
          </div>

          <div className="space-y-4">
            {data.popularServices.length ? (
              data.popularServices.map((service, index) => (
                <div key={service._id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-(--black)">
                      {index === 0 && (
                        <Award
                          size={14}
                          className="mr-1 inline text-(--champagne)"
                        />
                      )}
                      {service._id}
                    </span>
                    <strong>
                      {service.revenue.toLocaleString("fr-FR")} DA
                    </strong>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--surface)">
                    <div
                      className="h-full rounded-full bg-(--black)"
                      style={{
                        width: `${(service.revenue / maxServiceRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-(--muted)">
                    {service.sales} ventes
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--muted)">Aucun service vendu</p>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.005 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(33.333%-16px)]"
        >
          <div className="mb-5 flex items-center gap-2">
            <Receipt size={20} className="text-(--brown)" />
            <h2 className="font-semibold text-(--black)">Catégories</h2>
          </div>

          <div className="space-y-4">
            {data.categoryBreakdown.length ? (
              data.categoryBreakdown.map((cat) => (
                <div key={cat._id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-(--black)">
                      {cat.name}
                    </span>
                    <strong>{cat.revenue.toLocaleString("fr-FR")} DA</strong>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--surface)">
                    <div
                      className="h-full rounded-full bg-(--brown)"
                      style={{
                        width: `${(cat.revenue / maxCategoryRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-(--muted)">
                    {cat.sales} ventes
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--muted)">Aucune catégorie vendue</p>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.005 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6"
        >
          <h2 className="mb-5 font-semibold text-(--black)">
            Performance employés & caissiers
          </h2>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:flex-1">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-(--muted)">
                Employés
              </p>
              <div className="flex flex-wrap gap-4">
                {data.topEmployees.length ? (
                  data.topEmployees.map((employee, index) => (
                    <div
                      key={employee.employeeId}
                      className="w-full rounded-2xl bg-(--surface) p-5 sm:w-[calc(50%-8px)]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-(--black)">
                          {employee.name}
                        </p>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--black) text-xs font-bold text-(--champagne)">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-(--muted)">
                        CA :{" "}
                        <strong className="text-(--black)">
                          {employee.revenue.toLocaleString("fr-FR")} DA
                        </strong>
                      </p>
                      <p className="text-sm text-(--muted)">
                        Tickets :{" "}
                        <strong className="text-(--black)">
                          {employee.tickets}
                        </strong>
                      </p>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-(--champagne)"
                          style={{
                            width: `${(employee.revenue / maxEmployeeRevenue) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-(--muted)">
                    Aucun employé disponible
                  </p>
                )}
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-(--muted)">
                Caissiers
              </p>
              <div className="flex flex-wrap gap-4">
                {data.topCashiers.length ? (
                  data.topCashiers.map((cashier, index) => (
                    <div
                      key={cashier.userId}
                      className="w-full rounded-2xl bg-(--surface) p-5 sm:w-[calc(50%-8px)]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-(--black)">
                          {cashier.name}
                        </p>
                        <Badge variant="info">#{index + 1}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-(--muted)">
                        Encaissé :{" "}
                        <strong className="text-(--black)">
                          {cashier.revenue.toLocaleString("fr-FR")} DA
                        </strong>
                      </p>
                      <p className="text-sm text-(--muted)">
                        Tickets :{" "}
                        <strong className="text-(--black)">
                          {cashier.tickets}
                        </strong>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-(--muted)">
                    Aucun caissier disponible
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;

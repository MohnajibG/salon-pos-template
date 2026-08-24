import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Clock, DollarSign, Receipt, ShoppingBag, Users } from "lucide-react";

import { getTickets } from "../../api/ticket.api";
import { getClients } from "../../api/client.api";
import { getServices } from "../../api/service.api";

import type { Ticket } from "../../types/ticket";
import type { Client } from "../../types/client";
import type { Service } from "../../types/service";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import LoadingState from "../../components/ui/LoadingState";
import Badge from "../../components/ui/Badge";
import { formatMoney } from "../../config/currency";

const CashierDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [ticketsData, clientsData, servicesData] = await Promise.all([
          getTickets(),
          getClients(),
          getServices(),
        ]);

        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        setClients(
          Array.isArray(clientsData)
            ? clientsData
            : (clientsData.clients ?? []),
        );
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (err) {
        console.error("[CashierDashboard]", err);
        setError("Impossible de charger le dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const todayTickets = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          new Date(ticket.createdAt).toDateString() ===
          new Date().toDateString(),
      ),
    [tickets],
  );

  const totalToday = useMemo(
    () => todayTickets.reduce((sum, ticket) => sum + ticket.total, 0),
    [todayTickets],
  );

  const popularServices = useMemo(() => {
    const counter: Record<string, number> = {};

    todayTickets.forEach((ticket) => {
      ticket.items.forEach((item) => {
        counter[item.name] = (counter[item.name] || 0) + 1;
      });
    });

    return Object.entries(counter)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [todayTickets]);

  if (loading) return <LoadingState label="Chargement du dashboard..." />;

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 text-red-600">{error}</div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Cashier"
        title="SalonPro POS"
        description="Gestion des ventes et tickets du jour"
        icon={<Receipt size={24} />}
        action={<Badge variant="success">Réception active</Badge>}
      />

      <section className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={DollarSign}
            title="Chiffre du jour"
            value={formatMoney(totalToday)}
            accent="black"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Receipt}
            title="Tickets"
            value={todayTickets.length}
            accent="gold"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Users}
            title="Clients"
            value={clients.length}
            accent="info"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={ShoppingBag}
            title="Services"
            value={services.length}
            accent="success"
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-md border border-(--border) bg-white p-6 shadow-(--shadow-sm) xl:w-[calc(66.667%-8px)]"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-(--black)">Tickets du jour</h2>
            <Receipt size={20} className="text-(--brown)" />
          </div>

          <div className="space-y-3">
            {todayTickets.length === 0 && (
              <p className="text-sm text-(--muted)">Aucun ticket aujourd'hui</p>
            )}

            {todayTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex flex-col gap-3 rounded-2xl bg-(--surface) p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-(--black)">
                    {typeof ticket.client === "object"
                      ? `${ticket.client.firstName} ${ticket.client.lastName}`
                      : "Client inconnu"}
                  </p>

                  <p className="text-sm text-(--muted)">
                    {ticket.items.map((i) => i.name).join(", ")}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="font-bold text-(--brown-dark)">
                    {formatMoney(ticket.total)}
                  </p>

                  <p className="flex items-center gap-1 text-xs text-(--muted) sm:justify-end">
                    <Clock size={12} />
                    {new Date(ticket.createdAt).toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-md border border-(--border) bg-white p-6 shadow-(--shadow-sm) xl:w-[calc(33.333%-16px)]"
        >
          <h2 className="mb-5 font-semibold text-(--black)">
            Services populaires
          </h2>

          <div className="space-y-4">
            {popularServices.length === 0 && (
              <p className="text-sm text-(--muted)">Aucune donnée</p>
            )}

            {popularServices.map((service, index) => (
              <div
                key={service.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-(--black)">
                  #{index + 1} {service.name}
                </span>
                <strong className="text-(--black)">{service.count}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default CashierDashboard;

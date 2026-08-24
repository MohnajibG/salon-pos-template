import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  CalendarDays,
  WalletCards,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getClients } from "../../api/client.api";
import type { Client } from "../../types/client";
import { CURRENCY_LABEL } from "../../config/currency";

const Customers = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getClients();
        setClients(Array.isArray(data) ? data : (data.clients ?? []));
      } catch (error) {
        console.error("[Customers]", error);
        setError("Impossible de charger les clients.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        `${client.firstName} ${client.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [clients, search],
  );

  if (loading)
    return (
      <div className="flex min-h-100 items-center justify-center text-(--muted)">
        Chargement des clients...
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker">CRM</p>
          <h1 className="mt-3 font-title text-3xl font-bold">Clients</h1>
          <p className="subtext mt-2">Gestion des clients</p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)">
          <UserPlus size={18} />
          Nouveau client
        </button>
      </section>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <section className="rounded-3xl border border-(--border) bg-white p-5 shadow-(--shadow-sm)">
        <div className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--cream) p-4">
          <Search size={18} className="text-(--champagne)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full bg-transparent outline-none"
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-6">
        {filteredClients.map((client) => (
          <motion.article
            key={client._id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) sm:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-(--black) font-title text-xl font-bold text-(--cream)">
                {client.firstName?.charAt(0)}
                {client.lastName?.charAt(0)}
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  {client.firstName} {client.lastName}
                </h2>
                <p className="text-sm text-(--muted)">
                  {client.phone || "Téléphone non renseigné"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <div className="flex-1 rounded-2xl bg-(--surface) p-3">
                <div className="flex items-center gap-2 text-xs text-(--muted)">
                  <CalendarDays size={15} />
                  Visites
                </div>
                <p className="mt-2 font-bold">{client.visitCount ?? 0}</p>
              </div>

              <div className="flex-1 rounded-2xl bg-(--surface) p-3">
                <div className="flex items-center gap-2 text-xs text-(--muted)">
                  <WalletCards size={15} />
                  Total
                </div>
                <p className="mt-2 font-bold">{client.totalSpent ?? 0} {CURRENCY_LABEL}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-(--border) p-3">
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} className="text-(--champagne)" />
                Fidélité
              </div>
              <strong>{client.loyaltyPoints ?? 0}</strong>
            </div>

            <button className="mt-6 w-full rounded-xl border border-(--black) py-3 text-sm font-semibold text-(--black) transition hover:bg-(--black) hover:text-(--cream)">
              Voir historique
            </button>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Customers;

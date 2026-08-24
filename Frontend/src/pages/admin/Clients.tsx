import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Eye,
  Pencil,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { getClients } from "../../api/client.api";
import AddClientModal from "../../components/admin/AddClientModal";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import ClientReliabilityBadge from "../../components/clients/ClientReliabilityBadge";

interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  visitCount: number;
  noShowCount: number;
  attendedCount: number;
  totalSpent: number;
  lastVisit?: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getClients({ search, page: 1, limit: 20 });
      setClients(data.clients ?? []);
    } catch {
      setError("Impossible de charger les clients.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadClients, 400);
    return () => clearTimeout(timer);
  }, [loadClients]);

  const totalSpent = useMemo(
    () => clients.reduce((s, c) => s + c.totalSpent, 0),
    [clients],
  );
  const avgSpent = clients.length ? Math.round(totalSpent / clients.length) : 0;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Administration"
        title="Gestion des clients"
        description="Consultez les profils clients et leur historique."
        icon={<Users size={24} />}
        action={
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)"
          >
            <UserPlus size={18} />
            Ajouter un client
          </button>
        }
      />

      <section className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(33.333%-10.667px)]">
          <StatCard
            icon={Users}
            title="Total clients"
            value={clients.length}
            accent="black"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(33.333%-10.667px)]">
          <StatCard
            icon={Wallet}
            title="Chiffre cumulé"
            value={`${totalSpent.toLocaleString("fr-FR")} DA`}
            accent="gold"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(33.333%-10.667px)]">
          <StatCard
            icon={CalendarDays}
            title="Panier moyen"
            value={`${avgSpent.toLocaleString("fr-FR")} DA`}
            accent="info"
          />
        </div>
      </section>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un client..."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-(--border) bg-white">
        {loading ? (
          <LoadingState label="Chargement des clients..." />
        ) : clients.length === 0 ? (
          <div className="p-2">
            <EmptyState
              icon={Users}
              title="Aucun client trouvé"
              description="Ajustez votre recherche ou ajoutez un nouveau client."
            />
          </div>
        ) : (
          <div className="flex flex-col">
            {clients.map((client) => (
              <motion.div
                key={client._id}
                whileHover={{ backgroundColor: "var(--surface)" }}
                className="flex flex-col gap-5 border-b border-(--border) p-5 transition last:border-none lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-57.5 items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--black) text-sm font-bold text-(--champagne)">
                    {client.firstName?.charAt(0)}
                    {client.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-(--black)">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-sm text-(--muted)">
                      {client.email || "Email non renseigné"}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-(--muted)">Téléphone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>

                <div className="text-sm">
                  <p className="text-(--muted)">Visites</p>
                  <p className="font-semibold">{client.visitCount}</p>
                </div>

                <div className="text-sm">
                  <p className="text-(--muted)">Fiabilité</p>
                  <ClientReliabilityBadge client={client} />
                  {client.noShowCount > 0 && (
                    <p className="mt-1 text-xs text-(--muted)">
                      {client.noShowCount} absence
                      {client.noShowCount > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Wallet size={17} className="text-(--brown)" />
                  <span className="font-semibold">
                    {client.totalSpent.toLocaleString("fr-FR")} DA
                  </span>
                </div>

                <div className="text-sm">
                  <p className="text-(--muted)">Dernière visite</p>
                  <p>
                    {client.lastVisit
                      ? new Date(client.lastVisit).toLocaleDateString("fr-FR")
                      : "-"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream) text-(--brown) transition hover:scale-105">
                    <Eye size={17} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--black) text-white transition hover:scale-105">
                    <Pencil size={17} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AddClientModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadClients}
      />
    </div>
  );
};

export default Clients;

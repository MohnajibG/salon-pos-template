import { useEffect, useMemo, useState } from "react";
import { CreditCard, HandCoins, Receipt, Users } from "lucide-react";

import { getTickets, cancelTicket } from "../../api/ticket.api";
import type { Ticket, TicketStatus, PaymentMethod } from "../../types/ticket";

import TicketTable from "../../components/tables/TicketTable";
import ViewTicketModal from "../../components/ticket/ViewTicketModal";
import EditTicketModal from "../../components/ticket/EditTicketModal";
import CancelTicketModal from "../../components/ticket/CancelTicketModal";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import SearchBar from "../../components/ui/SearchBar";
import LoadingState from "../../components/ui/LoadingState";

type ModalType = "view" | "edit" | "cancel" | null;

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [payment, setPayment] = useState<"all" | PaymentMethod>("all");
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        if (!active) return;
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les tickets",
        );
      } finally {
        if (active) setLoading(false);
      }
    };
    loadTickets();
    return () => {
      active = false;
    };
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const clientName =
        typeof ticket.client === "object"
          ? `${ticket.client.firstName} ${ticket.client.lastName}`
          : "";
      const searchMatch =
        ticket.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        clientName.toLowerCase().includes(search.toLowerCase());
      const statusMatch = status === "all" || ticket.status === status;
      const paymentMatch =
        payment === "all" || ticket.paymentMethod === payment;
      return searchMatch && statusMatch && paymentMatch;
    });
  }, [tickets, search, status, payment]);

  const totalRevenue = useMemo(
    () =>
      tickets
        .filter((t) => t.status === "paid")
        .reduce((total, t) => total + t.total, 0),
    [tickets],
  );

  const totalClients = useMemo(
    () =>
      new Set(
        tickets.map((t) =>
          typeof t.client === "object" ? t.client._id : t.client,
        ),
      ).size,
    [tickets],
  );

  const handleCancel = async () => {
    if (!selectedTicket) return;
    try {
      setCancelLoading(true);
      const updated = await cancelTicket(selectedTicket._id);
      setTickets((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
      setSelectedTicket(null);
      setModal(null);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <LoadingState label="Chargement des tickets..." />;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Administration"
        title="Gestion des tickets"
        description="Suivez les ventes et paiements de votre commerce."
        icon={<Receipt size={24} />}
      />

      <div className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Receipt}
            title="Tickets"
            value={tickets.length}
            accent="black"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={HandCoins}
            title="Chiffre d'affaires"
            value={`${totalRevenue.toLocaleString("fr-FR")} DA`}
            accent="gold"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Users}
            title="Clients"
            value={totalClients}
            accent="info"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={CreditCard}
            title="Payés"
            value={tickets.filter((t) => t.status === "paid").length}
            accent="success"
          />
        </div>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un ticket..."
        right={
          <>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "all" | TicketStatus)
              }
              className="rounded-2xl border border-(--border) bg-white px-4 py-3 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payé</option>
              <option value="cancelled">Annulé</option>
            </select>
            <select
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value as "all" | PaymentMethod)
              }
              className="rounded-2xl border border-(--border) bg-white px-4 py-3 text-sm"
            >
              <option value="cash">Espèces</option>
            </select>
          </>
        }
      />

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <TicketTable
        tickets={filteredTickets}
        onView={(t) => {
          setSelectedTicket(t);
          setModal("view");
        }}
        onEdit={(t) => {
          setSelectedTicket(t);
          setModal("edit");
        }}
        onCancel={(t) => {
          setSelectedTicket(t);
          setModal("cancel");
        }}
      />

      {modal === "view" && selectedTicket && (
        <ViewTicketModal
          ticket={selectedTicket}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "edit" && selectedTicket && (
        <EditTicketModal
          ticket={selectedTicket}
          onClose={() => setModal(null)}
          onSaved={(updated) => {
            setTickets((current) =>
              current.map((item) =>
                item._id === updated._id ? updated : item,
              ),
            );
            setSelectedTicket(null);
          }}
        />
      )}
      {modal === "cancel" && selectedTicket && (
        <CancelTicketModal
          ticket={selectedTicket}
          loading={cancelLoading}
          onConfirm={handleCancel}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Tickets;

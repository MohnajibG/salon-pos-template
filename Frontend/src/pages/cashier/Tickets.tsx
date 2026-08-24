import { Eye, Search, Receipt, XCircle, X } from "lucide-react";

import useTickets from "../../hooks/useTickets";

import type { TicketStatus } from "../../types/ticket";
import { formatMoney, CURRENCY_LABEL } from "../../config/currency";

const statusLabels: Record<TicketStatus, string> = {
  waiting_payment: "En attente de paiement",
  paid: "Payé",
  cancelled: "Annulé",
};

const CashierTickets = () => {
  const {
    filteredTickets,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    selectedTicket,
    setSelectedTicket,
    handleCancel,
  } = useTickets();

  const cancelTicket = async (id: string) => {
    if (!confirm("Annuler ce ticket ?")) return;

    await handleCancel(id);
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-(--muted)">
        Chargement des tickets...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-3 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <p className="kicker">Caisse</p>

        <h1 className="font-title text-3xl font-bold">Historique tickets</h1>

        <p className="subtext">Consultez les ventes réalisées.</p>
      </section>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <section className="flex flex-col gap-4 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-(--border) bg-(--cream) p-3">
          <Search size={18} className="text-(--champagne)" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher ticket ou client..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | TicketStatus)}
          className="rounded-xl border border-(--border) p-3"
        >
          <option value="all">Tous</option>

          <option value="paid">Payés</option>

          <option value="cancelled">Annulés</option>
        </select>
      </section>

      <section className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        {!filteredTickets.length && (
          <p className="text-center text-(--muted)">Aucun ticket trouvé</p>
        )}

        <div className="flex flex-col gap-4">
          {filteredTickets.map((ticket) => {
            const client =
              typeof ticket.client === "object"
                ? `${ticket.client.firstName} ${ticket.client.lastName}`
                : "Client";

            return (
              <article
                key={ticket._id}
                className="flex flex-col gap-4 rounded-2xl bg-(--surface) p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Receipt size={18} />

                    <strong>{ticket.ticketNumber}</strong>
                  </div>

                  <span className="text-sm">{client}</span>

                  <span className="text-xs text-(--muted)">
                    {ticket.items.length} prestation(s)
                  </span>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <strong className="text-xl text-(--black)">
                    {formatMoney(ticket.total)}
                  </strong>

                  <span className="rounded-full bg-white px-3 py-1 text-xs">
                    {statusLabels[ticket.status]}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="rounded-xl bg-(--black) p-3 text-(--cream)"
                  >
                    <Eye size={18} />
                  </button>

                  {ticket.status === "paid" && (
                    <button
                      onClick={() => cancelTicket(ticket._id)}
                      className="rounded-xl bg-red-100 p-3 text-red-600"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-xl font-bold">
                {selectedTicket.ticketNumber}
              </h2>

              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-xl p-2 hover:bg-(--cream)"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-sm text-(--muted)">
              Payé le{" "}
              {new Date(selectedTicket.createdAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {selectedTicket.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-(--surface) p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>

                    <p className="text-xs text-(--muted)">
                      {item.duration} min
                    </p>
                  </div>

                  <strong>{formatMoney(item.finalPrice)}</strong>
                </div>
              ))}

              {selectedTicket.discount > 0 && (
                <div className="flex justify-between border-t border-(--border) pt-3 text-sm">
                  <span>Remise</span>

                  <strong>-{selectedTicket.discount} {CURRENCY_LABEL}</strong>
                </div>
              )}

              <div className="flex justify-between border-t border-(--border) pt-4 text-lg">
                <span>Total</span>

                <strong className="text-(--black)">
                  {formatMoney(selectedTicket.total)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierTickets;

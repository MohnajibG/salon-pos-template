import { History, X } from "lucide-react";

import type { Ticket } from "../../types/ticket";
import { CURRENCY_LABEL } from "../../config/currency";

interface ViewTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
}

const idOf = (value: string | { _id: string }) =>
  typeof value === "string" ? value : value._id;

const ViewTicketModal = ({ ticket, onClose }: ViewTicketModalProps) => {
  const client = typeof ticket.client === "object" ? ticket.client : null;
  const employee = typeof ticket.employee === "object" ? ticket.employee : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-(--border) bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
              Ticket
            </p>
            <h2 className="mt-2 text-2xl font-bold">{ticket.ticketNumber}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-(--border) p-2 hover:bg-(--cream)"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 rounded-2xl bg-(--surface) p-4">
          <div className="w-full sm:w-[calc(50%-8px)]">
            <p className="text-xs text-(--muted)">Client</p>
            <p className="font-medium">
              {client ? `${client.firstName} ${client.lastName}` : "-"}
            </p>
          </div>

          <div className="w-full sm:w-[calc(50%-8px)]">
            <p className="text-xs text-(--muted)">Employé</p>
            <p className="font-medium">
              {employee ? `${employee.firstName} ${employee.lastName}` : "-"}
            </p>
          </div>

          <div className="w-full sm:w-[calc(50%-8px)]">
            <p className="text-xs text-(--muted)">Paiement</p>
            <p className="font-medium capitalize">{ticket.paymentMethod}</p>
          </div>

          <div className="w-full sm:w-[calc(50%-8px)]">
            <p className="text-xs text-(--muted)">Date et heure du paiement</p>
            <p className="font-medium">
              {new Date(ticket.createdAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-semibold">Prestations</h3>

          <div className="space-y-3">
            {ticket.items.map((item, index) => (
              <div
                key={`${idOf(item.service)}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-(--border) p-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-(--muted)">{item.duration} min</p>
                </div>

                <p className="font-semibold">{item.finalPrice} {CURRENCY_LABEL}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-(--surface) p-4">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{ticket.subtotal} {CURRENCY_LABEL}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Remise</span>
            <span>- {ticket.discount} {CURRENCY_LABEL}</span>
          </div>

          <div className="flex justify-between border-t border-(--border) pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{ticket.total} {CURRENCY_LABEL}</span>
          </div>
        </div>

        {ticket.notes && (
          <div className="mt-5 rounded-2xl border border-(--border) p-4">
            <p className="text-xs text-(--muted)">Note</p>
            <p>{ticket.notes}</p>
          </div>
        )}

        {!!ticket.edits?.length && (
          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <History size={16} className="text-(--brown)" />
              <h3 className="font-semibold">Historique des modifications</h3>
            </div>

            <div className="space-y-2">
              {ticket.edits.map((edit, index) => {
                const editor =
                  typeof edit.editedBy === "object" ? edit.editedBy : null;

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm"
                  >
                    <p className="font-medium text-amber-800">
                      Modifié par{" "}
                      {editor
                        ? `${editor.firstName} ${editor.lastName}`
                        : "un administrateur"}{" "}
                      le{" "}
                      {new Date(edit.editedAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-amber-700">
                      Ancien total : {edit.previous.total} {CURRENCY_LABEL} (
                      {edit.previous.items.length} prestation
                      {edit.previous.items.length > 1 ? "s" : ""})
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTicketModal;

import { AlertTriangle, X } from "lucide-react";

import type { Ticket } from "../../types/ticket";

interface CancelTicketModalProps {
  ticket: Ticket;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const CancelTicketModal = ({
  ticket,
  loading,
  onConfirm,
  onClose,
}: CancelTicketModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl border border-(--border) bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-2 text-red-600">
              <AlertTriangle size={22} />
            </div>

            <h2 className="text-xl font-bold">Annuler le ticket</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-(--border) p-2 hover:bg-(--cream)"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-5 text-sm text-(--muted)">
          Voulez-vous vraiment annuler le ticket{" "}
          <span className="font-semibold text-(--black)">
            {ticket.ticketNumber}
          </span>{" "}
          ?
        </p>

        <p className="mt-2 text-sm text-(--muted)">
          Cette action retirera également les points fidélité et le montant
          dépensé du client.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-(--border) px-5 py-2 transition hover:bg-(--cream)"
          >
            Retour
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Annulation..." : "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelTicketModal;

import { Eye, Pencil, XCircle } from "lucide-react";
import type { Ticket } from "../../types/ticket";
import Badge from "../ui/Badge";
import { CURRENCY_LABEL } from "../../config/currency";

interface TicketTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onCancel: (ticket: Ticket) => void;
}

const TicketTable = ({ tickets, onView, onEdit, onCancel }: TicketTableProps) => {
  if (!tickets.length) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-8 text-center text-(--muted)">
        Aucun ticket trouvé.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-(--border) bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left">
          <thead className="border-b border-(--border) bg-(--surface)">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">Ticket</th>
              <th className="px-6 py-4 text-sm font-semibold">Client</th>
              <th className="px-6 py-4 text-sm font-semibold">Employé</th>
              <th className="px-6 py-4 text-sm font-semibold">Total</th>
              <th className="px-6 py-4 text-sm font-semibold">Paiement</th>
              <th className="px-6 py-4 text-sm font-semibold">Statut</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const client =
                typeof ticket.client === "object" ? ticket.client : null;
              const employee =
                typeof ticket.employee === "object" ? ticket.employee : null;

              return (
                <tr
                  key={ticket._id}
                  className="border-b border-(--border) last:border-none"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold">{ticket.ticketNumber}</p>
                    <p className="text-xs text-(--muted)">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {client ? `${client.firstName} ${client.lastName}` : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {employee
                      ? `${employee.firstName} ${employee.lastName}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 font-semibold">{ticket.total} {CURRENCY_LABEL}</td>
                  <td className="px-6 py-4 capitalize">
                    {ticket.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={ticket.status === "paid" ? "success" : "danger"}
                    >
                      {ticket.status === "paid" ? "Payé" : "Annulé"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onView(ticket)}
                        className="rounded-xl border border-(--border) p-2 transition hover:bg-(--cream)"
                        title="Voir"
                      >
                        <Eye size={18} />
                      </button>
                      {ticket.status === "paid" && (
                        <button
                          onClick={() => onEdit(ticket)}
                          className="rounded-xl border border-(--border) p-2 transition hover:bg-(--cream)"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {ticket.status === "paid" && (
                        <button
                          onClick={() => onCancel(ticket)}
                          className="rounded-xl border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                          title="Annuler"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;

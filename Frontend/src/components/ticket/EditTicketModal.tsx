import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";

import { getServices } from "../../api/service.api";
import { getEmployees } from "../../api/employee.api";
import { updateTicket } from "../../api/ticket.api";

import type { Service } from "../../types/service";
import type { Employee } from "../../types/employee";
import type { PaymentMethod, Ticket } from "../../types/ticket";
import { CURRENCY_LABEL } from "../../config/currency";

interface EditableItem {
  service: string;
  employee: string;
  name: string;
  finalPrice: number;
  duration: number;
}

interface EditTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSaved: (updated: Ticket) => void;
}

const idOf = (value: string | { _id: string }) =>
  typeof value === "string" ? value : value._id;

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Espèces",
  card: "Carte",
  transfer: "Virement",
};

const EditTicketModal = ({ ticket, onClose, onSaved }: EditTicketModalProps) => {
  const [items, setItems] = useState<EditableItem[]>(() =>
    ticket.items.map((item) => ({
      service: idOf(item.service),
      employee: idOf(item.employee),
      name: item.name,
      finalPrice: item.finalPrice,
      duration: item.duration ?? 0,
    })),
  );

  const [discount, setDiscount] = useState(ticket.discount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    ticket.paymentMethod,
  );
  const [notes, setNotes] = useState(ticket.notes ?? "");

  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newServiceId, setNewServiceId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesData, employeesData] = await Promise.all([
          getServices(),
          getEmployees(),
        ]);
        setServices(servicesData);
        setEmployees(
          employeesData.filter((e) => e.role === "employee" && e.isActive),
        );
      } catch (err) {
        console.error("[EditTicketModal] load:", err);
      }
    };

    load();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.finalPrice, 0);
  const total = Math.max(subtotal - discount, 0);

  const updateItem = (index: number, patch: Partial<EditableItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addService = () => {
    const service = services.find((s) => s._id === newServiceId);
    if (!service) return;

    setItems((prev) => [
      ...prev,
      {
        service: service._id,
        employee: "",
        name: service.name,
        finalPrice: service.price,
        duration: service.duration,
      },
    ]);
    setNewServiceId("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!items.length) {
      setError("Le ticket doit contenir au moins une prestation");
      return;
    }

    const missingEmployee = items.find((item) => !item.employee);
    if (missingEmployee) {
      setError(`Veuillez choisir un employé pour "${missingEmployee.name}"`);
      return;
    }

    try {
      setLoading(true);

      const updated = await updateTicket(ticket._id, {
        items: items.map((item) => ({
          service: item.service,
          employee: item.employee,
          finalPrice: item.finalPrice,
        })),
        discount,
        paymentMethod,
        notes,
      });

      onSaved(updated);
      onClose();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Impossible de modifier le ticket";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col gap-5 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            Administration
          </p>
          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Modifier {ticket.ticketNumber}
          </h2>
          <p className="mt-2 text-sm text-(--muted)">
            Toute modification est enregistrée dans l'historique du ticket.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-(--border) p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-(--muted)">
                    {item.duration} min
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label="Retirer"
                  className="rounded-xl p-2 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div className="sm:flex-1">
                  <label className="mb-1 block text-xs font-medium">
                    Prix final ({CURRENCY_LABEL})
                  </label>
                  <input
                    type="number"
                    value={item.finalPrice}
                    onChange={(e) =>
                      updateItem(index, {
                        finalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-(--border) p-2.5 outline-none"
                  />
                </div>

                <div className="sm:flex-1">
                  <label className="mb-1 block text-xs font-medium">
                    Employé
                  </label>
                  <select
                    value={item.employee}
                    onChange={(e) =>
                      updateItem(index, { employee: e.target.value })
                    }
                    className="w-full rounded-xl border border-(--border) bg-white p-2.5 outline-none"
                  >
                    <option value="">Choisir un employé</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={newServiceId}
            onChange={(e) => setNewServiceId(e.target.value)}
            className="flex-1 rounded-xl border border-(--border) bg-white p-3 outline-none"
          >
            <option value="">Ajouter une prestation...</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} — {service.price} {CURRENCY_LABEL}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={addService}
            disabled={!newServiceId}
            className="flex items-center gap-2 rounded-xl border border-(--border) px-4 py-3 transition hover:bg-(--cream) disabled:opacity-50"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="sm:flex-1">
            <label className="mb-2 block text-sm font-medium">Remise ({CURRENCY_LABEL})</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full rounded-xl border border-(--border) p-3 outline-none"
            />
          </div>

          <div className="sm:flex-1">
            <label className="mb-2 block text-sm font-medium">
              Mode de paiement
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
              className="w-full rounded-xl border border-(--border) bg-white p-3 outline-none"
            >
              {/* Carte et virement désactivés temporairement, seul
              l'espèce reste sélectionnable :
              {(Object.keys(paymentLabels) as PaymentMethod[]).map((key) => (
                <option key={key} value={key}>
                  {paymentLabels[key]}
                </option>
              ))}
              */}
              <option value="cash">{paymentLabels.cash}</option>
            </select>
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes..."
          rows={2}
          className="rounded-xl border border-(--border) p-3 outline-none"
        />

        <div className="flex items-center justify-between rounded-2xl bg-(--surface) p-4">
          <span className="text-sm text-(--muted)">Sous-total {subtotal} {CURRENCY_LABEL}</span>
          <strong className="text-lg">Total {total} {CURRENCY_LABEL}</strong>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-(--border) py-3"
          >
            Annuler
          </button>

          <button
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-(--black) py-3 font-semibold text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTicketModal;

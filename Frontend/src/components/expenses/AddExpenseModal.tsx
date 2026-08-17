import { useState } from "react";
import { Loader2, X } from "lucide-react";

import { createExpense } from "../../api/expense.api";
import type { ExpenseType } from "../../types/expense";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const todayLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AddExpenseModal = ({ open, onClose, onCreated }: AddExpenseModalProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<ExpenseType>("variable");
  const [date, setDate] = useState(todayLocal());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const reset = () => {
    setDescription("");
    setAmount("");
    setType("variable");
    setDate(todayLocal());
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!description.trim()) {
      setError("Veuillez saisir une description");
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Le montant doit être supérieur à 0");
      return;
    }

    try {
      setLoading(true);

      await createExpense({
        description: description.trim(),
        amount: numericAmount,
        type,
        date,
      });

      reset();
      onCreated();
      onClose();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Impossible d'ajouter la charge";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            Caisse
          </p>

          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Ajouter une charge
          </h2>

          <p className="mt-2 text-sm text-(--muted)">
            Ex : achat quotidien de produits, fournitures...
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-(--text)">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex : Achat shampoing"
              className="w-full rounded-xl border border-(--border) p-3 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-(--text)">
                Montant (DA)
              </label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-(--border) p-3 outline-none"
              />
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-(--text)">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-(--border) p-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-(--text)">
              Type de charge
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ExpenseType)}
              className="w-full rounded-xl border border-(--border) bg-white p-3 outline-none"
            >
              <option value="variable">Variable</option>
              <option value="semi-variable">Semi-variable</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Ajout...
              </>
            ) : (
              "Ajouter la charge"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;

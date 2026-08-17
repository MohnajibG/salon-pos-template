import { useState } from "react";
import { Loader2, Wallet, X } from "lucide-react";

import type { Employee } from "../../types/employee";

interface AdminOpenRegisterModalProps {
  open: boolean;
  cashiers: Employee[];
  onClose: () => void;
  onOpen: (cashierId: string, openingAmount: number) => Promise<unknown>;
}

const AdminOpenRegisterModal = ({
  open,
  cashiers,
  onClose,
  onOpen,
}: AdminOpenRegisterModalProps) => {
  const [cashierId, setCashierId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleClose = () => {
    setCashierId("");
    setAmount("");
    setError("");
    onClose();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!cashierId) {
      setError("Veuillez choisir un caissier");
      return;
    }

    const numericAmount = Number(amount);

    if (amount === "" || Number.isNaN(numericAmount) || numericAmount < 0) {
      setError("Montant d'ouverture invalide");
      return;
    }

    try {
      setLoading(true);
      await onOpen(cashierId, numericAmount);
      handleClose();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Impossible d'ouvrir cette caisse";
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
            Administration
          </p>
          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Ouvrir une caisse
          </h2>
          <p className="mt-2 text-sm text-(--muted)">
            Pour un caissier qui n'a pas encore ouvert la sienne aujourd'hui.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-(--text)">
              Caissier
            </label>
            <select
              value={cashierId}
              onChange={(e) => setCashierId(e.target.value)}
              className="w-full rounded-xl border border-(--border) bg-white p-3 outline-none"
            >
              <option value="">Choisir un caissier</option>
              {cashiers.map((cashier) => (
                <option key={cashier._id} value={cashier._id}>
                  {cashier.firstName} {cashier.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-(--text)">
              Fond de caisse (DA)
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-(--border) px-3">
              <Wallet size={18} className="text-(--brown)" />
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent p-3 outline-none"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Ouverture...
              </>
            ) : (
              "Ouvrir la caisse"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOpenRegisterModal;

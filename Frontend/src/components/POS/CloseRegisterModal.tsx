import { useState } from "react";
import { Loader2, Lock, TrendingDown, TrendingUp, X } from "lucide-react";

import type { CashRegister } from "../../types/cashRegister";

type Props = {
  register: CashRegister;
  onClose: (amount: number, notes?: string) => Promise<unknown>;
  onCancel: () => void;
  loading: boolean;
  error: string;
  title?: string;
  subtitle?: string;
  amountLabel?: string;
  submitLabel?: string;
  loadingLabel?: string;
  showPreviousClose?: boolean;
};

const CloseRegisterModal = ({
  register,
  onClose,
  onCancel,
  loading,
  error,
  title = "Fermeture de caisse",
  subtitle = `Résumé de la journée du ${register.date}`,
  amountLabel = "Comptage réel (DA)",
  submitLabel = "Clôturer la caisse",
  loadingLabel = "Fermeture...",
  showPreviousClose = false,
}: Props) => {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const expected = register.openingAmount + register.totals.cash;
  const numericAmount = Number(amount);
  const difference =
    amount === "" || Number.isNaN(numericAmount)
      ? null
      : numericAmount - expected;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === "" || Number.isNaN(numericAmount)) return;
    await onClose(numericAmount, notes).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Lock size={22} />
            </div>
            <div>
              <h2 className="font-title text-2xl font-bold">{title}</h2>
              <p className="text-sm text-(--muted)">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="rounded-xl border border-(--border) p-2 hover:bg-(--cream)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-(--surface) p-4 text-sm">
          <div className="w-[calc(50%-6px)]">
            <p className="text-(--muted)">Fond de départ</p>
            <p className="font-semibold">{register.openingAmount} DA</p>
          </div>
          <div className="w-[calc(50%-6px)]">
            <p className="text-(--muted)">Tickets encaissés</p>
            <p className="font-semibold">{register.totals.ticketsCount}</p>
          </div>
          <div className="w-[calc(50%-6px)]">
            <p className="text-(--muted)">Espèces encaissées</p>
            <p className="font-semibold">{register.totals.cash} DA</p>
          </div>
          <div className="w-[calc(50%-6px)]">
            <p className="text-(--muted)">Carte / Virement</p>
            <p className="font-semibold">
              {register.totals.card + register.totals.transfer} DA
            </p>
          </div>
          <div className="w-full border-t border-(--border) pt-3">
            <p className="text-(--muted)">
              Montant attendu en caisse (espèces)
            </p>
            <p className="text-lg font-bold">{expected} DA</p>
          </div>
        </div>

        {showPreviousClose && register.closingAmount !== undefined && (
          <div className="mt-4 rounded-2xl border border-(--border) p-4 text-sm">
            <p className="mb-2 font-semibold text-(--black)">
              Comptage déclaré à la fermeture
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="w-[calc(50%-6px)]">
                <p className="text-(--muted)">Comptage</p>
                <p className="font-semibold">{register.closingAmount} DA</p>
              </div>
              <div className="w-[calc(50%-6px)]">
                <p className="text-(--muted)">Écart</p>
                <p
                  className={`font-semibold ${
                    !register.difference
                      ? "text-green-700"
                      : register.difference > 0
                        ? "text-blue-700"
                        : "text-red-700"
                  }`}
                >
                  {register.difference === 0
                    ? "Aucun"
                    : `${register.difference && register.difference > 0 ? "+" : ""}${register.difference} DA`}
                </p>
              </div>
              {register.notes && (
                <div className="w-full">
                  <p className="text-(--muted)">Note</p>
                  <p>{register.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">{amountLabel}</label>
            <input
              autoFocus
              type="number"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant compté en caisse"
              className="mt-2 w-full rounded-2xl border border-(--border) p-3 text-lg font-semibold outline-none"
            />
          </div>

          {difference !== null && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-sm font-semibold ${
                difference === 0
                  ? "bg-green-50 text-green-700"
                  : difference > 0
                    ? "bg-blue-50 text-blue-700"
                    : "bg-red-50 text-red-700"
              }`}
            >
              {difference >= 0 ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingDown size={18} />
              )}
              {difference === 0
                ? "Caisse juste, aucun écart"
                : difference > 0
                  ? `Excédent de ${difference} DA`
                  : `Manque de ${Math.abs(difference)} DA`}
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Remarque (optionnel)..."
            rows={2}
            className="rounded-2xl border border-(--border) p-3 outline-none"
          />

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-(--border) py-3"
            >
              Annuler
            </button>

            <button
              disabled={loading || amount === ""}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {loadingLabel}
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloseRegisterModal;

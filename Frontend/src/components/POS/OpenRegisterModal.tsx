import { useState } from "react";
import { Lock, Loader2, Wallet } from "lucide-react";
import { CURRENCY_LABEL } from "../../config/currency";

type Props = {
  onOpen: (amount: number) => Promise<unknown>;
  loading: boolean;
  error: string;
};

const OpenRegisterModal = ({ onOpen, loading, error }: Props) => {
  const [amount, setAmount] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (Number.isNaN(value) || value < 0) return;
    await onOpen(value).catch(() => {});
  };

  return (
    <div className="flex min-h-100 w-full items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-(--border) bg-white p-8 shadow-(--shadow-md)">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--black) text-(--champagne)">
            <Lock size={28} />
          </div>

          <h2 className="mt-5 font-title text-2xl font-bold">
            Ouverture de caisse
          </h2>

          <p className="mt-2 text-sm text-(--muted)">
            Saisissez le fond de caisse de départ pour commencer votre journée.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--cream) px-4 py-3">
            <Wallet size={20} className="text-(--champagne)" />
            <input
              autoFocus
              type="number"
              min={0}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Montant en ${CURRENCY_LABEL}`}
              className="w-full bg-transparent text-lg font-semibold outline-none"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            disabled={loading || amount === ""}
            className="flex items-center justify-center gap-2 rounded-2xl bg-(--black) py-4 font-semibold text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
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

export default OpenRegisterModal;

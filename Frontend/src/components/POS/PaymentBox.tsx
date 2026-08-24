import { Banknote /* , CreditCard, WalletCards */ } from "lucide-react";

import type { PaymentMethod } from "../../hooks/usePOS";
import { CURRENCY_LABEL } from "../../config/currency";

type Props = {
  total: number;

  paymentMethod: PaymentMethod;

  setPaymentMethod: (method: PaymentMethod) => void;

  saving: boolean;

  checkout: () => void;
};

const PaymentBox = ({
  total,
  paymentMethod,
  setPaymentMethod,
  saving,
  checkout,
}: Props) => {
  const buttonClass = (active: boolean) =>
    `rounded-xl p-3 ${active ? "bg-(--black) text-(--cream)" : "bg-(--surface)"}`;

  return (
    <section className="mt-5 rounded-3xl border border-(--border) bg-white p-6">
      <div className="border-t border-(--border) pt-5">
        <div className="flex justify-between text-xl">
          <span>Total</span>

          <strong>{total} {CURRENCY_LABEL}</strong>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setPaymentMethod("cash")}
            className={`flex-1 ${buttonClass(paymentMethod === "cash")}`}
          >
            <Banknote size={18} className="mx-auto" />
          </button>

          {/* Paiement par carte désactivé temporairement
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex-1 ${buttonClass(paymentMethod === "card")}`}
          >
            <CreditCard size={18} className="mx-auto" />
          </button>
          */}

          {/* Paiement par virement désactivé temporairement
          <button
            onClick={() => setPaymentMethod("transfer")}
            className={`flex-1 ${buttonClass(paymentMethod === "transfer")}`}
          >
            <WalletCards size={18} className="mx-auto" />
          </button>
          */}
        </div>

        <button
          disabled={saving}
          onClick={checkout}
          className="mt-5 w-full rounded-xl bg-(--black) py-4 font-bold text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
        >
          {saving ? "Création..." : "Valider le paiement"}
        </button>
      </div>
    </section>
  );
};

export default PaymentBox;

import { useMemo } from "react";
import { CreditCard } from "lucide-react";

import type { DashboardData } from "../../api/dashboard.api";

interface PaymentBreakdownProps {
  data: DashboardData;
}

const money = (value: number) => `${value.toLocaleString("fr-FR")} DA`;

export default function PaymentBreakdown({ data }: PaymentBreakdownProps) {
  const maxPaymentRevenue = useMemo(() => {
    if (!data.paymentBreakdown?.length) return 0;

    return Math.max(...data.paymentBreakdown.map((item) => item.revenue));
  }, [data.paymentBreakdown]);

  return (
    <div className="rounded-3xl border border-[#eadfce] bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <CreditCard size={20} />

        <h2 className="font-semibold">Répartition par paiement</h2>
      </div>

      {!data.paymentBreakdown?.length ? (
        <p className="text-sm text-gray-500">Aucune donnée</p>
      ) : (
        <div className="space-y-4">
          {data.paymentBreakdown.map((item) => (
            <div key={item._id}>
              <div className="flex justify-between text-sm">
                <span className="capitalize">{item._id}</span>

                <strong>{money(item.revenue)}</strong>
              </div>

              <div className="mt-2 h-2 w-full rounded-full bg-[#f7f4ee]">
                <div
                  className="h-2 rounded-full bg-[#3E2C23]"
                  style={{
                    width: `${
                      maxPaymentRevenue > 0
                        ? (item.revenue / maxPaymentRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

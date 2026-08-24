import type { DashboardData } from "../../api/dashboard.api";
import { formatMoney as money } from "../../config/currency";

interface TopCashiersProps {
  data: DashboardData;
}

export default function TopCashiers({ data }: TopCashiersProps) {
  return (
    <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6">
      <h2 className="mb-5 font-semibold">Meilleurs vendeurs (caisse)</h2>

      <div className="space-y-3">
        {data.topCashiers?.length ? (
          data.topCashiers.map((cashier) => (
            <div
              key={cashier.userId}
              className="flex items-center justify-between rounded-2xl bg-[#f1f5f9] p-4"
            >
              <span className="font-semibold">{cashier.name}</span>

              <span className="text-right text-sm">
                <p className="font-bold">{money(cashier.revenue)}</p>

                <p className="text-gray-500">{cashier.tickets} tickets</p>
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucune donnée</p>
        )}
      </div>
    </div>
  );
}

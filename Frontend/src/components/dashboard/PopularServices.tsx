import { Sparkles } from "lucide-react";

import type { DashboardData } from "../../api/dashboard.api";
import { formatMoney as money } from "../../config/currency";

interface PopularServicesProps {
  data: DashboardData;
}

export default function PopularServices({ data }: PopularServicesProps) {
  return (
    <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles size={20} />

        <h2 className="font-semibold">Services populaires</h2>
      </div>

      {data.popularServices?.length ? (
        <div className="space-y-3">
          {data.popularServices.map((service) => (
            <div
              key={service._id}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>{service._id}</span>

              <span className="flex gap-4">
                <span className="text-gray-500">{service.sales} ventes</span>

                <strong>{money(service.revenue)}</strong>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Aucun service vendu</p>
      )}
    </div>
  );
}

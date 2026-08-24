import { useMemo } from "react";
import { Layers } from "lucide-react";

import type { DashboardData } from "../../api/dashboard.api";
import { formatMoney as money } from "../../config/currency";

interface CategoryBreakdownProps {
  data: DashboardData;
}

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const maxCategoryRevenue = useMemo(() => {
    if (!data.categoryBreakdown?.length) return 0;

    return Math.max(...data.categoryBreakdown.map((item) => item.revenue));
  }, [data.categoryBreakdown]);

  return (
    <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <Layers size={20} />

        <h2 className="font-semibold">Répartition par catégorie</h2>
      </div>

      {!data.categoryBreakdown?.length ? (
        <p className="text-sm text-gray-500">Aucune donnée</p>
      ) : (
        <div className="space-y-4">
          {data.categoryBreakdown.map((item) => (
            <div key={item._id}>
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>

                <strong>{money(item.revenue)}</strong>
              </div>

              <div className="mt-2 h-2 w-full rounded-full bg-[#f3f4f6]">
                <div
                  className="h-2 rounded-full bg-[#93c5fd]"
                  style={{
                    width: `${
                      maxCategoryRevenue > 0
                        ? (item.revenue / maxCategoryRevenue) * 100
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

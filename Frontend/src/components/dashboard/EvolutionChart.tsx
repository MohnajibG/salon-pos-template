import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import type { DashboardData } from "../../api/dashboard.api";

interface EvolutionChartProps {
  data: DashboardData;
}

const money = (value: number) => `${value.toLocaleString("fr-FR")} DA`;

export default function EvolutionChart({ data }: EvolutionChartProps) {
  const maxEvolutionRevenue = useMemo(() => {
    if (!data.evolution?.length) return 0;

    return Math.max(...data.evolution.map((item) => item.revenue));
  }, [data.evolution]);

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="rounded-3xl border border-[#eadfce] bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Évolution du chiffre d'affaires</h2>

        <TrendingUp size={20} />
      </div>

      {!data.evolution?.length ? (
        <p className="mt-6 text-sm text-gray-500">
          Aucune vente sur cette période
        </p>
      ) : (
        <div className="mt-6 flex h-56 items-end gap-2 overflow-x-auto rounded-2xl bg-[#f7f4ee] p-4">
          {data.evolution.map((item) => (
            <div
              key={item._id}
              className="flex min-w-10 flex-1 flex-col items-center justify-end gap-2"
              title={`${item._id} · ${money(item.revenue)} · ${item.tickets} tickets`}
            >
              <div
                className="w-full rounded-full bg-[#3E2C23]"
                style={{
                  height: `${
                    maxEvolutionRevenue > 0
                      ? Math.max((item.revenue / maxEvolutionRevenue) * 100, 4)
                      : 4
                  }%`,
                }}
              />

              <span className="text-[10px] text-gray-400">
                {item._id.slice(5)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

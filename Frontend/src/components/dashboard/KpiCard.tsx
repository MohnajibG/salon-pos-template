import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change?: number;
  danger?: boolean;
}

export default function KpiCard({
  icon: Icon,
  title,
  value,
  change,
  danger = false,
}: KpiCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-[#e2e8f0] bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        <Icon
          size={22}
          className={danger ? "text-red-500" : "text-[#0d9488]"}
        />
      </div>

      <h3
        className={`mt-4 text-3xl font-bold ${
          danger ? "text-red-600" : "text-[#0d9488]"
        }`}
      >
        {value}
      </h3>

      {typeof change === "number" && (
        <div
          className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change >= 0 ? "+" : ""}
          {change}% vs période précédente
        </div>
      )}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import type { ComponentType, ReactNode } from "react";

type Trend = { value: number; label?: string };

interface StatCardProps {
  icon: ComponentType<{ size?: number }>;
  title: string;
  value: string | number;
  trend?: Trend;
  accent?: "black" | "gold" | "success" | "danger" | "info";
  footer?: ReactNode;
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  black: "bg-(--black) text-(--champagne)",
  gold: "bg-(--champagne)/20 text-(--brown)",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-600",
  info: "bg-blue-100 text-blue-700",
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  accent = "gold",
  footer,
}: StatCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="flex flex-col justify-between rounded-3xl border border-(--border) bg-white p-6 transition-shadow hover:shadow-(--shadow-sm)"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-(--muted)">{title}</p>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentStyles[accent]}`}
      >
        <Icon size={20} />
      </div>
    </div>

    <div className="mt-4 flex items-end justify-between">
      <h3 className="font-title text-3xl font-bold text-(--black)">{value}</h3>

      {trend && (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            trend.value >= 0
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {trend.value >= 0 ? "+" : ""}
          {trend.value}
          {trend.label ?? "%"}
        </span>
      )}
    </div>

    {footer && <div className="mt-3 text-xs text-(--muted)">{footer}</div>}
  </motion.div>
);

export default StatCard;

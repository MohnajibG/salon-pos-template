import type { ReactNode } from "react";

type Variant = "success" | "danger" | "warning" | "info" | "neutral" | "gold";

const variants: Record<Variant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-stone-100 text-stone-600",
  gold: "bg-(--champagne)/25 text-(--brown-dark)",
};

const Badge = ({
  variant = "neutral",
  children,
}: {
  variant?: Variant;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
  >
    {children}
  </span>
);

export default Badge;

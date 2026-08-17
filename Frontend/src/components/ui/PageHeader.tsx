import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const PageHeader = ({
  kicker,
  title,
  description,
  icon,
  action,
}: PageHeaderProps) => (
  <motion.section
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
  >
    <div className="flex items-start gap-4">
      {icon && (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--black) text-(--champagne)">
          {icon}
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--brown)">
          {kicker}
        </p>

        <h1 className="mt-2 font-title text-3xl font-bold text-(--black)">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-(--muted)">{description}</p>
        )}
      </div>
    </div>

    {action && <div className="shrink-0">{action}</div>}
  </motion.section>
);

export default PageHeader;

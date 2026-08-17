import type { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ size?: number }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-(--border) bg-(--surface) py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-(--brown)">
      <Icon size={26} />
    </div>

    <p className="font-semibold text-(--black)">{title}</p>

    {description && (
      <p className="max-w-sm text-sm text-(--muted)">{description}</p>
    )}

    {action}
  </div>
);

export default EmptyState;

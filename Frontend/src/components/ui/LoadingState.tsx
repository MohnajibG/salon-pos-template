import { Loader2 } from "lucide-react";

const LoadingState = ({ label = "Chargement..." }: { label?: string }) => (
  <div className="flex min-h-100 flex-col items-center justify-center gap-3 text-(--muted)">
    <Loader2 size={28} className="animate-spin text-(--brown)" />
    <p className="text-sm">{label}</p>
  </div>
);

export default LoadingState;

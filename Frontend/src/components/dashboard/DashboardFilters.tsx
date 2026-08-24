import type { DashboardPeriod } from "../../api/dashboard.api";

interface DashboardFiltersProps {
  period: DashboardPeriod;
  setPeriod: (value: DashboardPeriod) => void;

  date: string;
  setDate: (value: string) => void;

  startDate: string;
  setStartDate: (value: string) => void;

  endDate: string;
  setEndDate: (value: string) => void;
}

const periodOptions: {
  value: DashboardPeriod;
  label: string;
}[] = [
  { value: "day", label: "Jour" },
  { value: "week", label: "Semaine" },
  { value: "month", label: "Mois" },
  { value: "year", label: "Année" },
  { value: "custom", label: "Personnalisé" },
];

export default function DashboardFilters({
  period,
  setPeriod,
  date,
  setDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DashboardFiltersProps) {
  return (
    <section className="rounded-3xl border border-[#e2e8f0] bg-white p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-[#64748b]">ADMIN</p>

      <h1 className="mt-3 font-serif text-3xl font-bold">Dashboard</h1>

      <p className="mt-2 text-sm text-gray-500">
        Vue globale de gestion Flowdesk
      </p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                period === option.value
                  ? "bg-[#0d9488] text-[#ffffff]"
                  : "bg-[#f1f5f9] text-gray-600 hover:bg-[#e2e8f0]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {period !== "custom" ? (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm"
          />
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm"
            />

            <span className="text-sm text-gray-400">→</span>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm"
            />
          </div>
        )}
      </div>
    </section>
  );
}

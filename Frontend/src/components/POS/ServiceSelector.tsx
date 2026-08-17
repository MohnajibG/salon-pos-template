import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion } from "framer-motion";

import type { Service } from "../../types/service";

type Props = {
  services: Service[];
  search: string;
  setSearch: (value: string) => void;
  addService: (service: Service) => void;
};

const ServiceSelector = ({
  services,
  search,
  setSearch,
  addService,
}: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const groupedServices = useMemo(() => {
    const groups = new Map<string, Service[]>();

    for (const service of services) {
      const categoryName = service.category?.name ?? "Autres";
      const group = groups.get(categoryName) ?? [];
      group.push(service);
      groups.set(categoryName, group);
    }

    return Array.from(groups.entries());
  }, [services]);

  return (
    <section className="rounded-3xl border border-(--border) bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-(--border) p-3">
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une prestation..."
            className="w-full outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-(--border) px-4 py-3 text-sm font-medium transition hover:bg-(--cream)"
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          {collapsed ? "Afficher" : "Réduire"}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-5 space-y-5">
          {groupedServices.map(([categoryName, groupServices]) => (
            <div key={categoryName}>
              <h3 className="mb-3 text-l font-bold uppercase tracking-[0.2em] text-(--muted)">
                {categoryName}
              </h3>

              <div className="flex flex-wrap gap-3">
                {groupServices.map((service) => (
                  <motion.button
                    key={service._id}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addService(service)}
                    className="w-full rounded-xl border border-(--border) p-3 text-left transition hover:border-(--black) hover:bg-(--cream) sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {service.name}
                        </p>

                        <p className="text-xs text-(--muted)">
                          {service.duration} min
                        </p>
                      </div>

                      <strong className="shrink-0 text-sm">
                        {service.price} DA
                      </strong>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}

          {!groupedServices.length && (
            <p className="text-sm text-(--muted)">Aucune prestation trouvée</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ServiceSelector;

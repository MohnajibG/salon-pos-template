import { motion } from "framer-motion";
import { Sparkles, CalendarDays, User, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";

import { getMyEmployeeProfile } from "../../api/employee.api";
import type { Employee } from "../../types/employee";

interface EmployeeService {
  _id: string;
  name: string;
  category: string;
  client: string;
  date: string;
  price: number;
  status: string;
}

const Services = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [services, setServices] = useState<EmployeeService[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getMyEmployeeProfile();

        setEmployee(profile);

        // FUTUR API :
        // const data = await getMyEmployeeServices();
        // setServices(data);

        setServices([]);
      } catch (error) {
        console.error("Erreur chargement services", error);
      }
    };

    load();
  }, []);

  if (!employee) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        Chargement...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl border border-(--border) bg-white px-5 py-7 shadow-(--shadow-sm) sm:px-8">
        <p className="ak-kicker">Espace employé</p>

        <h1 className="mt-3 font-title text-3xl font-bold">
          Mes prestations
        </h1>

        <p className="ak-muted mt-2">Historique des prestations réalisées</p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-3xl border border-(--border) bg-white p-6 text-center text-(--muted) shadow-(--shadow-sm)">
          Aucune prestation disponible
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {services.map((service) => (
            <motion.div
              key={service._id}
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-(--cream) p-4">
                    <Sparkles size={25} className="text-(--black)" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">{service.name}</h2>

                    <p className="ak-muted text-sm">{service.category}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex w-full items-center gap-2 sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]">
                    <User size={16} />
                    {service.client}
                  </div>

                  <div className="flex w-full items-center gap-2 sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]">
                    <CalendarDays size={16} />

                    {new Date(service.date).toLocaleDateString("fr-FR")}
                  </div>

                  <div className="flex w-full items-center gap-2 sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]">
                    <HandCoins size={16} />

                    <span className="font-semibold">
                      {service.price.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  <span className="w-full rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:w-[calc(50%-6px)] lg:w-[calc(25%-9px)]">
                    {service.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;

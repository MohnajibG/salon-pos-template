import { motion } from "framer-motion";
import { HandCoins, Sparkles, Users, TrendingUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMyEmployeeProfile } from "../../api/employee.api";

import type { Employee } from "../../types/employee";

const MyStatistics = () => {
  const { month } = useParams();

  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyEmployeeProfile();

        setEmployee(data);
      } catch (error) {
        console.error("Erreur profil employé", error);
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

  const currentMonth = month ?? new Date().toISOString().slice(0, 7);

  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl border border-(--border) bg-white px-5 py-7 shadow-(--shadow-sm) sm:px-8">
        <p className="ak-kicker">Statistiques employé</p>

        <h1 className="mt-3 font-title text-3xl font-bold">
          Performance de {employee.firstName}
        </h1>

        <p className="ak-muted mt-2">{employee.speciality ?? "Employé"}</p>

        <div className="mt-4 inline-flex rounded-xl bg-(--champagne)/20 px-4 py-2 text-sm font-semibold text-(--brown-dark)">
          {currentMonth}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard title="Chiffre d'affaires" value="0 €" icon={HandCoins} />
        </div>

        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard title="Prestations réalisées" value="0" icon={Sparkles} />
        </div>

        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard title="Clients reçus" value="0" icon={Users} />
        </div>

        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard title="Panier moyen" value="0 €" icon={TrendingUp} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:w-[calc(66.667%-8px)]"
        >
          <h2 className="mb-5 font-semibold">
            Évolution du chiffre d'affaires
          </h2>

          <div className="flex h-64 items-end gap-3 rounded-3xl bg-(--surface) p-5">
            {[30, 45, 60, 40, 70, 80, 65].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-(--black)"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>

          <p className="ak-muted mt-4 text-sm">
            Évolution quotidienne du mois sélectionné
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:w-[calc(33.333%-16px)]"
        >
          <h2 className="mb-5 font-semibold">Résumé mensuel</h2>

          <div className="space-y-4 text-sm">
            <p>
              Meilleure prestation :<b> - </b>
            </p>

            <p>
              Meilleur jour :<b> - </b>
            </p>

            <p>
              Évolution :<b className="ml-2 text-green-600">-</b>
            </p>
          </div>
        </motion.div>

        <motion.div className="w-full rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
          <h2 className="mb-5 font-semibold">Prestations réalisées</h2>

          <div className="rounded-2xl bg-(--surface) p-5 text-sm text-(--muted)">
            Aucune donnée disponible
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)"
  >
    <div className="flex justify-between">
      <div>
        <p className="ak-muted text-sm">{title}</p>

        <h3 className="mt-2 text-2xl font-bold">{value}</h3>
      </div>

      <div className="rounded-full bg-(--cream) p-4">
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);

export default MyStatistics;

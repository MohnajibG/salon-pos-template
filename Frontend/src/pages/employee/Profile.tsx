import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Scissors,
  CalendarDays,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getMyEmployeeProfile } from "../../api/employee.api";

import type { Employee } from "../../types/employee";

const Profile = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyEmployeeProfile();

        setEmployee(data);
      } catch (error) {
        console.error("Erreur chargement profil", error);
      }
    };

    loadProfile();
  }, []);

  if (!employee) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        Chargement du profil...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-3xl border border-(--border) bg-white p-8 shadow-(--shadow-sm)"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-(--black) text-(--cream)">
            <User size={55} />
          </div>

          <div>
            <p className="ak-kicker">Profil employé</p>

            <h1 className="mt-2 font-title text-3xl font-bold">
              {employee.firstName} {employee.lastName}
            </h1>

            <p className="ak-muted mt-2">
              {employee.role === "employee" ? "Employé" : "Caissier"}

              {" · "}

              {employee.speciality ?? "-"}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <CheckCircle size={16} />

              {employee.isActive ? "Actif" : "Inactif"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* QUICK STATS */}

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-[calc(33.333%-10.667px)]">
          <StatCard title="Prestations réalisées" value="-" />
        </div>

        <div className="w-full md:w-[calc(33.333%-10.667px)]">
          <StatCard title="Chiffre du mois" value="-" />
        </div>

        <div className="w-full md:w-[calc(33.333%-10.667px)]">
          <StatCard title="Clients reçus" value="-" />
        </div>
      </div>

      {/* INFORMATIONS */}

      <div className="flex flex-col gap-5 lg:flex-row">
        <motion.div
          className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:flex-1"
          whileHover={{
            scale: 1.01,
          }}
        >
          <h2 className="mb-5 text-lg font-bold">Informations personnelles</h2>

          <div className="space-y-4 text-sm">
            <Info
              icon={<Mail size={18} />}
              label="Email"
              value={employee.email}
            />

            <Info
              icon={<Phone size={18} />}
              label="Téléphone"
              value={employee.phone || "-"}
            />

            <Info
              icon={<CalendarDays size={18} />}
              label="Création du compte"
              value={
                employee.createdAt
                  ? new Date(employee.createdAt).toLocaleDateString("fr-FR")
                  : "-"
              }
            />
          </div>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:flex-1"
          whileHover={{
            scale: 1.01,
          }}
        >
          <h2 className="mb-5 text-lg font-bold">
            Informations professionnelles
          </h2>

          <div className="space-y-4 text-sm">
            <Info
              icon={<Scissors size={18} />}
              label="Spécialité"
              value={employee.speciality ?? "-"}
            />

            <Info
              icon={<CheckCircle size={18} />}
              label="Statut du compte"
              value={employee.isActive ? "Actif" : "Inactif"}
            />
          </div>
        </motion.div>
      </div>

      {/* ACTION */}

      <div className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <button className="rounded-xl bg-(--black) px-6 py-3 font-semibold text-(--cream) transition hover:bg-(--brown-dark)">
          Modifier mon profil
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <motion.div
    whileHover={{
      y: -4,
    }}
    className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)"
  >
    <p className="ak-muted text-sm">{title}</p>

    <h2 className="mt-2 text-3xl font-bold">{value}</h2>
  </motion.div>
);

const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="rounded-xl bg-(--cream) p-3 text-(--black)">{icon}</div>

    <div>
      <p className="ak-muted text-xs">{label}</p>

      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default Profile;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  Sparkles,
  CalendarDays,
  Wallet,
  TrendingUp,
  Clock,
  Award,
  Star,
  User,
} from "lucide-react";

import { getEmployeeById } from "../../api/employee.api";

import type { Employee } from "../../types/employee";
import { SPECIALITY_LABELS } from "../../types/speciality";
import { CURRENCY_LABEL } from "../../config/currency";

const recentServices = [
  {
    client: "Emma Martin",
    service: "Service 1",
    price: `120 ${CURRENCY_LABEL}`,
    date: "Aujourd'hui • 10:30",
  },
  {
    client: "Julie Martin",
    service: "Service 2",
    price: `40 ${CURRENCY_LABEL}`,
    date: "Aujourd'hui • 09:00",
  },
  {
    client: "Sarah Lopez",
    service: "Service 3",
    price: `25 ${CURRENCY_LABEL}`,
    date: "Hier",
  },
];

const EmployeeDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const data = await getEmployeeById(id);

        setEmployee(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message || "Employé introuvable");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-10 text-center text-(--brown)">
        Chargement du profil...
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
        {error || "Employé introuvable"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm border border-(--border)"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      {/* PROFIL */}

      <section className="flex flex-col gap-8 rounded-3xl border border-(--border) bg-white p-6 lg:flex-row">
        <div className="flex flex-col items-center">
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-(--cream) text-(--brown)">
            <User size={55} />
          </div>

          <span
            className={`
            mt-5 rounded-full px-4 py-2 text-sm font-semibold
            ${
              employee.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
            `}
          >
            {employee.isActive ? "Actif" : "Inactif"}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.35em] text-(--brown)">
            Profil employé
          </p>

          <h1 className="mt-3 font-title text-4xl font-bold">
            {employee.firstName} {employee.lastName}
          </h1>

          <p className="mt-2 text-(--muted)">
            {employee.role === "employee" ? "Employé" : "Caissier"}
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<Phone size={18} />}
                label="Téléphone"
                value={employee.phone || "Non renseigné"}
              />
            </div>

            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<Mail size={18} />}
                label="Email"
                value={employee.email}
              />
            </div>

            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<Sparkles size={18} />}
                label="Spécialité"
                value={
                  employee.speciality
                    ? SPECIALITY_LABELS[employee.speciality]
                    : "Non définie"
                }
              />
            </div>

            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<CalendarDays size={18} />}
                label="Création compte"
                value={
                  employee.createdAt
                    ? new Date(employee.createdAt).toLocaleDateString()
                    : "-"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="flex flex-wrap gap-4">
        <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <Card title="Chiffre généré" value={`0 ${CURRENCY_LABEL}`} icon={<Wallet />} />
        </div>

        <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <Card title="Rendez-vous" value="0" icon={<CalendarDays />} />
        </div>

        <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <Card title="Panier moyen" value={`0 ${CURRENCY_LABEL}`} icon={<TrendingUp />} />
        </div>

        <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <Card title="Heures" value="0 h" icon={<Clock />} />
        </div>
      </section>

      {/* PERFORMANCE */}

      <section className="flex flex-wrap gap-6">
        <motion.div
          whileHover={{
            scale: 1.01,
          }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(66.667%-8px)]"
        >
          <h2 className="mb-6 text-xl font-semibold">Evolution mensuelle</h2>

          <div className="flex h-64 items-end gap-4 rounded-3xl bg-(--cream) p-6">
            {[40, 55, 65, 70, 60, 85, 90].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-(--brown)"
                style={{
                  height: `${height}%`,
                }}
              />
            ))}
          </div>
        </motion.div>

        <div className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(33.333%-16px)]">
          <h2 className="mb-5 text-xl font-semibold">Performance</h2>

          <div className="space-y-4">
            <Stat icon={<Award />} title="Meilleure employée" value="0 fois" />

            <Stat icon={<Star />} title="Note clients" value="N/A" />

            <Stat icon={<Sparkles />} title="Service préféré" value="N/A" />
          </div>
        </div>
      </section>

      {/* HISTORIQUE */}

      <section className="rounded-3xl border border-(--border) bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold">Dernières prestations</h2>

        <div className="space-y-4">
          {recentServices.map((service) => (
            <motion.div
              key={service.client}
              whileHover={{
                x: 5,
              }}
              className="flex flex-col gap-3 rounded-2xl border border-(--border) bg-(--soft) p-5 sm:flex-row sm:justify-between"
            >
              <div>
                <p className="font-semibold">{service.client}</p>

                <p className="text-sm text-(--muted)">{service.service}</p>
              </div>

              <div className="sm:text-right">
                <p className="font-bold text-(--brown)">{service.price}</p>

                <p className="text-xs text-(--muted)">{service.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Card = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-(--border) bg-white p-6"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-(--muted)">{title}</p>

          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>

        <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>
      </div>
    </motion.div>
  );
};

const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>

      <div>
        <p className="text-sm text-(--muted)">{label}</p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

const Stat = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-(--soft) p-4">
      <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>

      <div>
        <p className="text-sm text-(--muted)">{title}</p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default EmployeeDetails;

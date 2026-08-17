import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, UserRound, Briefcase } from "lucide-react";

import { authApi } from "../../api/auth.api";

import type { AuthUser } from "../../types/auth";

const Profile = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await authApi.me();

        setUser(response.user);
      } catch (error) {
        console.error("[Profile]", error);
        setError("Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-100 items-center justify-center text-(--muted)">
        Chargement du profil...
      </div>
    );

  if (error || !user)
    return (
      <div className="rounded-3xl bg-red-50 p-6 text-red-600">
        {error || "Utilisateur introuvable"}
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-(--black) p-6 text-(--cream) shadow-(--shadow-sm) sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-(--champagne)">
            Compte
          </p>

          <h1 className="mt-3 font-title text-3xl font-bold">Mon Profil</h1>

          <p className="mt-2 text-sm text-(--cream)/60">
            Gestion de vos informations personnelles
          </p>
        </div>

        <div className="rounded-xl bg-white/10 px-5 py-3 text-sm uppercase tracking-widest">
          {user.role}
        </div>
      </section>

      <div className="flex flex-wrap gap-6">
        <motion.section
          whileHover={{ y: -5 }}
          className="flex w-full flex-col items-center justify-center rounded-3xl border border-(--border) bg-white p-6 text-center shadow-(--shadow-sm) lg:w-[32%]"
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-(--black) font-title text-4xl font-bold text-(--champagne)">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>

          <p className="mt-3 rounded-full bg-(--champagne)/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-(--brown)">
            {user.role}
          </p>
        </motion.section>

        <section className="flex-1 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
          <h2 className="mb-5 text-xl font-bold">Informations personnelles</h2>

          <div className="flex flex-wrap gap-4">
            <InfoCard
              icon={UserRound}
              label="Nom complet"
              value={`${user.firstName} ${user.lastName}`}
            />

            <InfoCard icon={Mail} label="Email" value={user.email} />

            <InfoCard
              icon={Briefcase}
              label="Spécialité"
              value={user.speciality || "Non renseignée"}
            />

            <InfoCard
              icon={ShieldCheck}
              label="Statut"
              value={user.isActive ? "Actif" : "Inactif"}
            />
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <h2 className="text-xl font-bold">Sécurité</h2>

        <p className="ak-muted mt-2">Gestion du mot de passe du compte.</p>

        <button className="mt-5 rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)">
          Modifier le mot de passe
        </button>
      </section>
    </div>
  );
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) => (
  <div className="flex min-w-60 flex-1 items-center gap-4 rounded-2xl bg-(--surface) p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--black) text-(--champagne)">
      <Icon size={20} />
    </div>

    <div>
      <p className="text-xs text-(--muted)">{label}</p>

      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default Profile;

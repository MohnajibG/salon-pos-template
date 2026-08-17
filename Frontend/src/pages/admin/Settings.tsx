import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

import { authApi } from "../../api/auth.api";
import type { AuthUser } from "../../types/auth";

import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import LoadingState from "../../components/ui/LoadingState";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const Settings = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await authApi.me();
        setUser(response.user);
      } catch (err) {
        console.error("[Settings]", err);
        setError("Impossible de charger vos informations");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <LoadingState label="Chargement de vos paramètres..." />;
  }

  if (error || !user) {
    return (
      <div className="rounded-3xl bg-red-50 p-6 text-red-600">
        {error || "Utilisateur introuvable"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Administration"
        title="Paramètres du compte"
        description="Gérez vos informations personnelles et la sécurité de votre compte."
        icon={<UserIcon size={24} />}
      />

      <section className="flex flex-col gap-6 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-(--black) font-title text-3xl font-bold text-(--champagne)">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </div>

        <div>
          <h2 className="font-title text-2xl font-bold text-(--black)">
            {user.firstName} {user.lastName}
          </h2>

          <p className="mt-1 text-sm text-(--muted)">{user.email}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-(--champagne)/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-(--brown)">
              Administrateur
            </span>

            <Badge variant={user.isActive ? "success" : "danger"}>
              {user.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <h2 className="mb-5 text-lg font-bold text-(--black)">
          Informations personnelles
        </h2>

        <div className="flex flex-wrap gap-4">
          <Info icon={<Mail size={18} />} label="Email" value={user.email} />

          <Info
            icon={<Phone size={18} />}
            label="Téléphone"
            value={user.phone || "-"}
          />

          <Info
            icon={<ShieldCheck size={18} />}
            label="Statut du compte"
            value={user.isActive ? "Actif" : "Inactif"}
          />

          <Info
            icon={<CalendarDays size={18} />}
            label="Création du compte"
            value={formatDate(user.createdAt)}
          />

          <Info
            icon={<Clock size={18} />}
            label="Dernière connexion"
            value={formatDateTime(user.lastLogin)}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <h2 className="text-lg font-bold text-(--black)">Sécurité</h2>

        <p className="mt-2 text-sm text-(--muted)">
          Changez régulièrement votre mot de passe pour protéger votre compte.
        </p>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="mt-5 flex items-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)"
        >
          <KeyRound size={18} />
          Modifier le mot de passe
        </button>
      </section>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
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
}) => (
  <div className="flex min-w-60 flex-1 items-center gap-4 rounded-2xl bg-(--surface) p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--black) text-(--champagne)">
      {icon}
    </div>

    <div>
      <p className="text-xs text-(--muted)">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default Settings;

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Wallet,
  Scissors,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

type Role = "admin" | "cashier" | "employee";

const roles: {
  role: Role;
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}[] = [
  {
    role: "admin",
    icon: ShieldCheck,
    title: "Administration",
    description:
      "Pilotez l'institut : équipe, prestations, statistiques et caisses.",
  },
  {
    role: "cashier",
    icon: Wallet,
    title: "Caisse",
    description: "Encaissez les ventes et gérez les tickets au quotidien.",
  },
  {
    role: "employee",
    icon: Scissors,
    title: "Employé",
    description: "Consultez votre planning et suivez vos prestations.",
  },
];

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const user = data.user;
      const token = data.token;

      if (!user || !user.role) {
        throw new Error("Informations utilisateur invalides");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const dashboardByRole: Record<Role, string> = {
        admin: "/admin/dashboard",
        cashier: "/cashier/dashboard",
        employee: "/employee/dashboard",
      };

      // Seuls les employés et les caissiers changent leur mot de passe
      // lors de la première connexion.
      if (user.role !== "admin" && user.mustChangePassword === true) {
        navigate("/change-password", {
          replace: true,
        });

        return;
      }

      const role = user.role as Role;

      navigate(dashboardByRole[role], {
        replace: true,
      });
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? "Email ou mot de passe incorrect")
        : "Impossible de se connecter au serveur";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-(--cream) p-4 sm:p-6 lg:p-8">
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-(--white) shadow-(--shadow-md) lg:max-w-6xl lg:flex-row">
        {/* PANNEAU ACCÈS PROFESSIONNEL */}
        <div className="relative hidden min-h-162.5 flex-1 flex-col justify-between overflow-hidden p-12 text-(--white) lg:flex">
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              backgroundImage: "linear-gradient(135deg, #111827 0%, #1e3a8a 100%)",
            }}
          />

          <div className="absolute inset-0 bg-(--black)/75" />
          <div className="absolute inset-0 bg-linear-to-t from-(--black)/90 via-(--black)/60 to-(--black)/40" />

          <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative z-10">
            <a href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--champagne) font-title text-lg font-bold text-(--black)">
                SP
              </span>

              <span className="flex flex-col leading-none">
                <span className="font-title text-xl tracking-[0.15em] text-(--champagne)">
                  SALONPRO
                </span>
                <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.45em] text-(--white)/50">
                  Institute
                </span>
              </span>
            </a>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-12"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--champagne)">
                Espace professionnel
              </p>

              <h1 className="mt-4 font-title text-3xl font-bold leading-tight">
                Un accès dédié à chaque métier de l'institut
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-7 text-(--white)/60">
                Un seul portail de connexion, un espace de travail adapté à
                votre rôle dans le salon.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            {roles.map(({ role, icon: Icon, title, description }, index) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-4 rounded-2xl border border-(--white)/10 bg-(--white)/10 p-5 backdrop-blur-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-200/15 text-blue-200">
                  <Icon size={20} />
                </span>

                <div>
                  <p className="font-semibold text-(--white)">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-(--white)/55">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FORMULAIRE */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-md flex-col"
          >
            {/* Logo mobile (le panneau pro n'est visible qu'à partir de lg) */}
            <a href="/" className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--black) font-title text-base font-bold text-(--champagne)">
                SP
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-title text-lg tracking-[0.15em] text-(--black)">
                  SALONPRO
                </span>
                <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.4em] text-(--brown)">
                  Institute
                </span>
              </span>
            </a>

            <div className="mb-8">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-(--brown)">
                Connexion professionnelle
              </p>

              <h2 className="mt-3 font-title text-4xl font-bold text-(--dark)">
                Bienvenue
              </h2>

              <p className="mt-3 font-body text-sm text-(--muted)">
                Connectez-vous à votre espace : Admin, Caisse ou Employé.
              </p>

              {/* Rappel des rôles, visible sous lg où le panneau est masqué */}
              <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
                {roles.map(({ role, icon: Icon, title }) => (
                  <span
                    key={role}
                    className="flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-2 text-xs font-medium text-(--brown-dark)"
                  >
                    <Icon size={14} />
                    {title}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-semibold text-(--text)">
                  Email
                </label>

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@salonpro.com"
                  className="w-full appearance-none rounded-2xl border border-(--border) bg-(--white) px-6 py-4 font-body text-base outline-none transition placeholder:text-(--muted) focus:border-(--gold) focus:ring-4 focus:ring-(--gold)/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-semibold text-(--text)">
                  Mot de passe
                </label>

                <div className="relative flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full appearance-none rounded-2xl border border-(--border) bg-(--white) px-6 py-4 pr-14 font-body text-base outline-none transition placeholder:text-(--muted) focus:border-(--gold) focus:ring-4 focus:ring-(--gold)/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-(--muted) transition hover:text-(--black)"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-(--black) px-8 font-body font-semibold text-(--white) transition hover:bg-(--gold) disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <div className="mt-10 text-center font-body text-xs uppercase tracking-[0.3em] text-(--muted)">
              SALONPRO APP
              <br />
              Édition professionnelle
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;

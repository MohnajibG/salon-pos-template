import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "cashier" | "employee";

interface PasswordInputProps {
  value: string;
  setValue: (value: string) => void;
  show: boolean;
  setShow: (value: boolean) => void;
  placeholder: string;
}

const PasswordInput = ({
  value,
  setValue,
  show,
  setShow,
  placeholder,
}: PasswordInputProps) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={placeholder}
      className="
        w-full
        rounded-2xl
        border
        border-(--border)
        bg-(--white)
        px-6
        py-4
        pr-14
        font-body
        text-base
        outline-none
        transition
        focus:border-(--gold)
        focus:ring-4
        focus:ring-(--gold)/10
      "
    />

    <button
      type="button"
      onClick={() => setShow(!show)}
      className="
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        text-(--muted)
        hover:text-(--black)
      "
    >
      {show ? <EyeOff size={19} /> : <Eye size={19} />}
    </button>
  </div>
);

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");

      return;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");

      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://site--ankelk--dnxhn8mdblq5.code.run/api/auth/change-password",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? "Erreur lors du changement de mot de passe",
        );
      }

      const storedUser = localStorage.getItem("user");

      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.role) {
        throw new Error("Utilisateur introuvable");
      }

      const updatedUser = {
        ...user,
        mustChangePassword: false,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      const dashboardByRole: Record<Role, string> = {
        admin: "/admin/dashboard",

        cashier: "/cashier/dashboard",

        employee: "/employee/dashboard",
      };

      const role = user.role as Role;

      navigate(dashboardByRole[role], {
        replace: true,
      });
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      relative
      flex
      min-h-screen
      w-full
      items-center
      justify-center
      bg-(--cream)
      p-4
    "
    >
      <div
        className="
        absolute
        inset-0
        bg-black/10
      "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          bg-(--white)
          p-8
          shadow-(--shadow-md)
        "
      >
        <div className="mb-10">
          <h1
            className="
            font-title
            text-4xl
            font-bold
            text-(--dark)
          "
          >
            Nouveau mot de passe
          </h1>

          <p
            className="
            mt-3
            font-body
            text-sm
            text-(--muted)
          "
          >
            Sécurisez votre compte avant de continuer.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            flex
            flex-col
            gap-5
          "
        >
          <PasswordInput
            value={currentPassword}
            setValue={setCurrentPassword}
            show={showCurrent}
            setShow={setShowCurrent}
            placeholder="Mot de passe actuel"
          />

          <PasswordInput
            value={newPassword}
            setValue={setNewPassword}
            show={showNew}
            setShow={setShowNew}
            placeholder="Nouveau mot de passe"
          />

          <PasswordInput
            value={confirmPassword}
            setValue={setConfirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
            placeholder="Confirmer le nouveau mot de passe"
          />

          {error && (
            <div
              className="
              rounded-xl
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
            >
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="
              flex
              min-h-14
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-(--black)
              font-body
              font-semibold
              text-white
              transition
              hover:bg-(--gold)
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Modification...
              </>
            ) : (
              "Changer le mot de passe"
            )}
          </button>
        </form>

        <div
          className="
          mt-8
          text-center
          font-body
          text-xs
          uppercase
          tracking-[0.3em]
          text-(--muted)
        "
        >
          SALONPRO APP
          <br />
          Édition professionnelle
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;

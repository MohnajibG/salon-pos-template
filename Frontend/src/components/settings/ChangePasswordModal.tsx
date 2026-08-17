import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";

import { authApi } from "../../api/auth.api";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) {
    return null;
  }

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
      await authApi.changePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Impossible de modifier le mot de passe";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <KeyRound size={22} />
              </div>

              <h2 className="mt-4 font-title text-2xl font-bold text-(--black)">
                Mot de passe modifié
              </h2>

              <p className="mt-2 text-sm text-(--muted)">
                Votre mot de passe a été mis à jour avec succès.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
                Sécurité
              </p>

              <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
                Modifier le mot de passe
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <PasswordField
                label="Mot de passe actuel"
                value={currentPassword}
                onChange={setCurrentPassword}
                show={showPasswords}
                onToggleShow={() => setShowPasswords((v) => !v)}
              />

              <PasswordField
                label="Nouveau mot de passe"
                value={newPassword}
                onChange={setNewPassword}
                show={showPasswords}
                onToggleShow={() => setShowPasswords((v) => !v)}
              />

              <PasswordField
                label="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showPasswords}
                onToggleShow={() => setShowPasswords((v) => !v)}
              />

              <button
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Modification...
                  </>
                ) : (
                  "Modifier le mot de passe"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggleShow,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-(--text)">
      {label}
    </label>

    <div className="relative flex items-center gap-3 rounded-xl border border-(--border) px-3">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent p-3 pr-10 outline-none"
      />

      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 text-(--muted) transition hover:text-(--black)"
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  </div>
);

export default ChangePasswordModal;

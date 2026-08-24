/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { X, UserPlus, Loader2 } from "lucide-react";

import { createClient } from "../../api/client.api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddClientModal = ({ open, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: "",
    notes: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await createClient(form);
      onSuccess();
      onClose();

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        gender: "",
        birthDate: "",
        notes: "",
      });
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            CRM
          </p>

          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Ajouter un client
          </h2>

          <p className="mt-2 text-sm text-(--muted)">
            Créer une nouvelle fiche client
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              required
              className="h-11 rounded-2xl border border-(--border) bg-(--cream) px-4 outline-none focus:ring-2 focus:ring-(--brown)/20 sm:flex-1"
            />

            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Nom"
              required
              className="h-11 rounded-2xl border border-(--border) bg-(--cream) px-4 outline-none focus:ring-2 focus:ring-(--brown)/20 sm:flex-1"
            />
          </div>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Téléphone"
            required
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          >
            <option value="">Genre</option>

            <option value="female">Femme</option>

            <option value="male">Homme</option>
          </select>

          <input
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Remarques..."
            rows={3}
            className="w-full rounded-2xl border border-(--border) bg-(--cream) p-4"
          />

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--black) py-3 font-semibold text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Créer le client
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;

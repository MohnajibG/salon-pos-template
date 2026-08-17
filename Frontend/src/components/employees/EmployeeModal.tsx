/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

import EmployeeForm from "./EmployeeForm";

import { createEmployee } from "../../api/employee.api";

import type { EmployeeForm as EmployeeFormType } from "../../types/employee";

interface EmployeeModalProps {
  open: boolean;

  onClose: () => void;

  onCreated: () => void;
}

const EmployeeModal = ({
  open,

  onClose,

  onCreated,
}: EmployeeModalProps) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [temporaryPassword, setTemporaryPassword] = useState("");

  const [copied, setCopied] = useState(false);

  if (!open) {
    return null;
  }

  const handleCreate = async (data: EmployeeFormType) => {
    try {
      setLoading(true);

      setError("");

      const result = await createEmployee(data);

      setTemporaryPassword(result.temporaryPassword);

      onCreated();
    } catch (error: any) {
      setError(error.message || "Erreur création employé");
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    await navigator.clipboard.writeText(temporaryPassword);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        {!temporaryPassword ? (
          <>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
                Administration
              </p>

              <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
                Ajouter un employé
              </h2>

              <p className="mt-2 text-sm text-(--muted)">
                Un mot de passe temporaire sera généré automatiquement.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <EmployeeForm loading={loading} onSubmit={handleCreate} />
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
                Employé créé
              </p>

              <h2 className="mt-2 font-title text-2xl font-bold">
                Mot de passe temporaire
              </h2>
            </div>

            <div className="rounded-2xl bg-(--cream) p-5 text-center">
              <p className="text-3xl font-bold tracking-widest">
                {temporaryPassword}
              </p>
            </div>

            <button
              onClick={copyPassword}
              className="flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream)"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copié
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copier le mot de passe
                </>
              )}
            </button>

            <button
              onClick={() => {
                setTemporaryPassword("");

                onClose();
              }}
              className="rounded-xl border border-(--border) py-3"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeModal;

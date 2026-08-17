/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X } from "lucide-react";

import EmployeeForm from "./EmployeeForm";

import { updateEmployee } from "../../api/employee.api";

import type { Employee, EmployeeForm as EmployeeFormType } from "../../types/employee";

interface EditEmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
  onUpdated: () => void;
}

const EditEmployeeModal = ({
  employee,
  onClose,
  onUpdated,
}: EditEmployeeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!employee) {
    return null;
  }

  const initialValues: EmployeeFormType = {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    role: employee.role,
    speciality: employee.speciality,
  };

  const handleUpdate = async (data: EmployeeFormType) => {
    try {
      setLoading(true);
      setError("");

      await updateEmployee(employee._id, data);

      onUpdated();
      onClose();
    } catch (error: any) {
      setError(error.message || "Erreur lors de la modification de l'employé");
    } finally {
      setLoading(false);
    }
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

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            Administration
          </p>

          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Modifier l'employé
          </h2>

          <p className="mt-2 text-sm text-(--muted)">
            {employee.firstName} {employee.lastName}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <EmployeeForm
          initialValues={initialValues}
          loading={loading}
          onSubmit={handleUpdate}
          submitLabel="Enregistrer"
          loadingLabel="Enregistrement..."
        />
      </div>
    </div>
  );
};

export default EditEmployeeModal;

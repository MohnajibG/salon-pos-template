import { useState } from "react";
import { Mail, Phone, User } from "lucide-react";

import type {
  EmployeeForm as EmployeeFormType,
  EmployeeRole,
  Speciality,
} from "../../types/employee";

interface EmployeeFormProps {
  initialValues?: EmployeeFormType;
  loading?: boolean;
  onSubmit: (data: EmployeeFormType) => void;
  submitLabel?: string;
  loadingLabel?: string;
}

const roles: {
  value: EmployeeRole;
  label: string;
}[] = [
  {
    value: "employee",
    label: "Employé",
  },
  {
    value: "cashier",
    label: "Caissier",
  },
];

const specialities: {
  value: Speciality;
  label: string;
}[] = [
  {
    value: "Hair",
    label: "Coiffure",
  },
  {
    value: "Nails",
    label: "Onglerie",
  },
  {
    value: "Makeup",
    label: "Maquillage",
  },
  {
    value: "Massage",
    label: "Massage",
  },
  {
    value: "Reception",
    label: "Accueil",
  },
  {
    value: "Waxing",
    label: "Épilation",
  },
  {
    value: "Skincare",
    label: "Soin du visage",
  },
];

const defaultValues: EmployeeFormType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "employee",
  speciality: "Hair",
};

const EmployeeForm = ({
  initialValues = defaultValues,
  loading = false,
  onSubmit,
  submitLabel = "Créer l'employé",
  loadingLabel = "Création...",
}: EmployeeFormProps) => {
  const [form, setForm] = useState<EmployeeFormType>(initialValues);

  const [error, setError] = useState("");

  const updateField = (key: keyof EmployeeFormType, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRoleChange = (role: EmployeeRole) => {
    setForm((prev) => ({
      ...prev,
      role,
      speciality: role === "employee" ? (prev.speciality ?? "Hair") : undefined,
    }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return "Le prénom et le nom sont obligatoires";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Email invalide";
    }

    if (form.role === "employee" && !form.speciality) {
      return "La spécialité est obligatoire pour un employé";
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate();

    if (validation) {
      setError(validation);

      return;
    }

    setError("");

    const data: EmployeeFormType = {
      ...form,
      speciality: form.role === "employee" ? form.speciality : undefined,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:flex-1">
          <Input
            icon={<User size={17} />}
            placeholder="Prénom"
            value={form.firstName}
            onChange={(v) => updateField("firstName", v)}
          />
        </div>

        <div className="sm:flex-1">
          <Input
            icon={<User size={17} />}
            placeholder="Nom"
            value={form.lastName}
            onChange={(v) => updateField("lastName", v)}
          />
        </div>
      </div>

      <Input
        icon={<Mail size={17} />}
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(v) => updateField("email", v)}
      />

      <Input
        icon={<Phone size={17} />}
        placeholder="Téléphone"
        value={form.phone}
        onChange={(v) => updateField("phone", v)}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={form.role}
          onChange={(e) => handleRoleChange(e.target.value as EmployeeRole)}
          className="rounded-xl border border-(--border) bg-white p-3 outline-none sm:flex-1"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        {form.role === "employee" && (
          <select
            value={form.speciality ?? ""}
            onChange={(e) => updateField("speciality", e.target.value)}
            className="rounded-xl border border-(--border) bg-white p-3 outline-none sm:flex-1"
          >
            {specialities.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        disabled={loading}
        className="mt-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) disabled:opacity-50"
      >
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
};

const Input = ({
  icon,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-(--border) px-3">
      <span className="text-(--brown)">{icon}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent p-3 outline-none"
      />
    </div>
  );
};

export default EmployeeForm;

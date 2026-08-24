import { motion } from "framer-motion";
import { Eye, Pencil, Power, Trash2, Sparkles, Phone, Clock } from "lucide-react";

import type { Employee } from "../../types/employee";
import { SPECIALITY_LABELS } from "../../types/speciality";
import Badge from "../ui/Badge";

interface EmployeeCardProps {
  employee: Employee;
  onStatusChange: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onSchedule: (id: string) => void;
}

const EmployeeCard = ({
  employee,
  onStatusChange,
  onDelete,
  onView,
  onEdit,
  onSchedule,
}: EmployeeCardProps) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: "var(--surface)" }}
      className="flex flex-col gap-5 border-b border-(--border) p-5 last:border-none lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex min-w-55 items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--black) text-sm font-bold text-(--champagne)">
          {employee.firstName.charAt(0)}
          {employee.lastName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-(--black)">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-sm text-(--muted)">
            {employee.role === "employee" ? "Employé" : "Caissier"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Sparkles size={17} className="text-(--brown)" />
        <span>
          {employee.speciality
            ? SPECIALITY_LABELS[employee.speciality]
            : "Non définie"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-(--muted)">
        <Phone size={16} />
        <span>{employee.phone || "Aucun téléphone"}</span>
      </div>

      <Badge variant={employee.isActive ? "success" : "danger"}>
        {employee.isActive ? "Actif" : "Inactif"}
      </Badge>

      <div className="flex gap-2">
        <button
          onClick={() => onView(employee._id)}
          aria-label="Voir"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream)"
        >
          <Eye size={17} />
        </button>
        <button
          onClick={() => onEdit(employee._id)}
          aria-label="Modifier"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--black) text-white"
        >
          <Pencil size={17} />
        </button>
        <button
          onClick={() => onSchedule(employee._id)}
          title="Horaires de travail"
          aria-label="Horaires de travail"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream)"
        >
          <Clock size={17} />
        </button>
        <button
          onClick={() => onStatusChange(employee._id, !employee.isActive)}
          aria-label={employee.isActive ? "Désactiver" : "Activer"}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"
        >
          <Power size={17} />
        </button>
        <button
          onClick={() => onDelete(employee._id)}
          aria-label="Supprimer"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;

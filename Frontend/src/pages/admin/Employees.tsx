import { useCallback, useEffect, useState } from "react";
import { Plus, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getEmployees,
  updateEmployeeStatus,
  deleteEmployee,
} from "../../api/employee.api";
import type { Employee } from "../../types/employee";

import EmployeeCard from "../../components/employees/EmployeeCard";
import EmployeeModal from "../../components/employees/EmployeeModal";
import EditEmployeeModal from "../../components/employees/EditEmployeeModal";
import EmployeeScheduleModal from "../../components/employees/EmployeeScheduleModal";
import EmployeeStats from "../../components/employees/EmployeeStats";

import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [scheduleEmployeeId, setScheduleEmployeeId] = useState<string | null>(
    null,
  );

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEmployees({ search });
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadEmployees, 400);
    return () => clearTimeout(timer);
  }, [loadEmployees]);

  const handleStatus = async (id: string, isActive: boolean) => {
    await updateEmployeeStatus(id, isActive);
    await loadEmployees();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet employé ?")) return;
    await deleteEmployee(id);
    await loadEmployees();
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Administration"
        title="Gestion des employés"
        description="Gérez votre équipe et les accès utilisateurs."
        icon={<UserCog size={24} />}
        action={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)"
          >
            <Plus size={18} />
            Ajouter un employé
          </button>
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un employé..."
      />

      <EmployeeStats employees={employees} />

      <section className="overflow-hidden rounded-3xl border border-(--border) bg-white">
        {loading ? (
          <LoadingState label="Chargement des employés..." />
        ) : employees.length === 0 ? (
          <div className="p-2">
            <EmptyState
              icon={UserCog}
              title="Aucun employé trouvé"
              description="Ajoutez un premier employé pour commencer."
            />
          </div>
        ) : (
          employees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onStatusChange={handleStatus}
              onDelete={handleDelete}
              onView={(id) => navigate(`/admin/employees/${id}`)}
              onEdit={(id) =>
                setEditEmployee(
                  employees.find((employee) => employee._id === id) ?? null,
                )
              }
              onSchedule={(id) => setScheduleEmployeeId(id)}
            />
          ))
        )}
      </section>

      <EmployeeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadEmployees}
      />

      <EditEmployeeModal
        employee={editEmployee}
        onClose={() => setEditEmployee(null)}
        onUpdated={loadEmployees}
      />

      {scheduleEmployeeId && (
        <EmployeeScheduleModal
          employeeId={scheduleEmployeeId}
          onClose={() => setScheduleEmployeeId(null)}
        />
      )}
    </div>
  );
};

export default Employees;

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UserRound, X, Scissors } from "lucide-react";

import { getEmployees } from "../../api/employee.api";

import type { Employee } from "../../types/employee";

interface Props {
  value?: Employee | null;
  onChange: (employee: Employee | null) => void;
}

const EmployeeAutocomplete = ({ value, onChange }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = useCallback(async () => {
    if (search.trim().length < 2) return;

    try {
      setLoading(true);
      setError("");

      const data = await getEmployees({
        search,
        role: "employee",
        isActive: true,
        limit: 10,
      });

      setEmployees(data);
    } catch (err) {
      console.error("[EmployeeAutocomplete]", err);
      setError("Impossible de charger les employés.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!open || search.length < 2) return;

    const timer = setTimeout(loadEmployees, 300);

    return () => clearTimeout(timer);
  }, [open, search, loadEmployees]);

  const filteredEmployees = useMemo(() => {
    if (search.length < 2) return [];

    return employees.filter((employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [employees, search]);

  const selectEmployee = (employee: Employee) => {
    onChange(employee);
    setSearch("");
    setOpen(false);
  };

  const clearEmployee = () => {
    onChange(null);
    setSearch("");
    setOpen(true);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <label className="text-sm font-semibold text-(--black)">Employé</label>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-(--champagne)"
        />

        <input
          value={value ? `${value.firstName} ${value.lastName}` : search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);

            if (value) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un employé..."
          className="h-12 w-full rounded-2xl border border-(--border) bg-white pl-11 pr-12 outline-none focus:border-(--black)"
        />

        {value && (
          <button
            type="button"
            onClick={clearEmployee}
            className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-(--cream)"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full z-30 mt-2 flex max-h-72 w-full flex-col overflow-hidden rounded-3xl border border-(--border) bg-white shadow-xl">
          {loading && (
            <p className="p-5 text-sm text-stone-500">
              Recherche des employés...
            </p>
          )}

          {error && (
            <p className="bg-red-50 p-5 text-sm text-red-700">{error}</p>
          )}

          {!loading &&
            !error &&
            filteredEmployees.map((employee) => (
              <button
                key={employee._id}
                type="button"
                onClick={() => selectEmployee(employee)}
                className="flex items-center gap-4 border-b border-(--border) px-5 py-4 text-left hover:bg-(--cream)"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream)">
                  <UserRound size={18} />
                </div>

                <div>
                  <p className="font-semibold text-(--black)">
                    {employee.firstName} {employee.lastName}
                  </p>

                  {employee.speciality && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                      <Scissors size={13} />
                      {employee.speciality}
                    </p>
                  )}
                </div>
              </button>
            ))}

          {!loading &&
            !error &&
            search.length >= 2 &&
            filteredEmployees.length === 0 && (
              <p className="p-5 text-sm text-stone-500">
                Aucun employé trouvé.
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default EmployeeAutocomplete;

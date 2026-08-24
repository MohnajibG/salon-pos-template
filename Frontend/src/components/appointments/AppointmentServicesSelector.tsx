import { useMemo, useState } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";

import type { Service } from "../../types/service";
import type { Employee } from "../../types/employee";
import type { AppointmentService } from "../../types/appointment";
import { SPECIALITY_LABELS } from "../../types/speciality";
import { CURRENCY_LABEL } from "../../config/currency";

interface AppointmentServicesSelectorProps {
  services: Service[];
  employees: Employee[];

  selectedServices: AppointmentService[];

  onChange: (services: AppointmentService[]) => void;
  defaultEmployeeId?: string;
}

const AppointmentServicesSelector = ({
  services,
  employees,
  selectedServices,
  onChange,
  defaultEmployeeId,
}: AppointmentServicesSelectorProps) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const groupedServices = useMemo(() => {
    return services.reduce<Record<string, Service[]>>((groups, service) => {
      const category = service.category?.name ?? "Autres";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(service);

      return groups;
    }, {});
  }, [services]);

  const toggleCategory = (category: string) => {
    setOpenCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const selected = (id: string) => {
    return selectedServices.some((item) => item.service === id);
  };

  // Les prestations créées avant l'ajout du champ spécialité n'en ont pas
  // encore : dans ce cas on ne filtre pas (l'admin doit la renseigner dans
  // Services, mais ça ne doit pas empêcher de prendre rendez-vous)
  const eligibleEmployeesFor = (service: Service) => {
    const employeesOnly = employees.filter(
      (employee) => employee.role === "employee",
    );

    if (!service.speciality) {
      return employeesOnly;
    }

    return employeesOnly.filter(
      (employee) => employee.speciality === service.speciality,
    );
  };

  const toggleService = (service: Service) => {
    if (selected(service._id)) {
      onChange(selectedServices.filter((item) => item.service !== service._id));

      return;
    }

    const eligibleEmployees = eligibleEmployeesFor(service);

    // Chaque employé n'a qu'un seul poste : on choisit automatiquement
    // l'employé préféré (créneau cliqué en vue Jour) ou, à défaut, le
    // premier employé compatible avec la prestation
    const autoEmployee =
      eligibleEmployees.find((employee) => employee._id === defaultEmployeeId) ??
      eligibleEmployees[0];

    onChange([
      ...selectedServices,

      {
        service: service._id,

        employee: autoEmployee?._id ?? "",

        name: service.name,

        price: service.price,

        duration: service.duration,
      },
    ]);
  };

  const updateEmployee = (serviceId: string, employeeId: string) => {
    onChange(
      selectedServices.map((item) =>
        item.service === serviceId
          ? {
              ...item,

              employee: employeeId,
            }
          : item,
      ),
    );
  };

  if (!services.length) {
    return (
      <div
        className="
        rounded-2xl
        border border-(--border)
        bg-(--cream)
        p-5
        text-sm
        text-stone-500
        "
      >
        Aucune prestation disponible
      </div>
    );
  }

  return (
    <div
      className="
      flex
      flex-col
      gap-4
      "
    >
      <div
        className="
        flex
        items-center
        gap-2
        "
      >
        <Sparkles size={18} className="text-(--champagne)" />

        <label
          className="
          text-sm
          font-semibold
          "
        >
          Choisir les prestations
        </label>
      </div>

      {Object.entries(groupedServices).map(([category, items]) => {
        const opened = openCategories.includes(category);

        return (
          <div
            key={category}
            className="
              overflow-hidden
              rounded-3xl
              border border-(--border)
              bg-white
              "
          >
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className="
                flex
                w-full
                items-center
                justify-between
                px-5
                py-4
                hover:bg-(--cream)
                "
            >
              <span className="font-semibold">{category}</span>

              <ChevronDown
                size={20}
                className={`
                  transition-transform
                  ${opened ? "rotate-180" : ""}
                  `}
              />
            </button>

            {opened && (
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-(--border)
                  bg-(--cream)
                  p-4
                  "
              >
                {items.map((service) => {
                  const item = selectedServices.find(
                    (s) => s.service === service._id,
                  );

                  const isActive = !!item;
                  const eligibleEmployees = eligibleEmployeesFor(service);
                  const disabled = !isActive && eligibleEmployees.length === 0;

                  return (
                    <div
                      key={service._id}
                      className={`
                      rounded-2xl
                      border
                      p-4
                      ${
                        isActive
                          ? "border-(--black) bg-(--black) text-(--cream)"
                          : disabled
                            ? "border-(--border) bg-stone-100 opacity-60"
                            : "border-(--border) bg-white"
                      }
                      `}
                    >
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleService(service)}
                        className="
                        flex
                        w-full
                        items-center
                        justify-between
                        text-left
                        disabled:cursor-not-allowed
                        "
                      >
                        <div>
                          <p
                            className="
                            font-semibold
                            "
                          >
                            {service.name}
                          </p>

                          <p
                            className={`
                            mt-1
                            text-sm
                            ${isActive ? "text-(--cream)" : "text-stone-500"}
                            `}
                          >
                            {service.price} {CURRENCY_LABEL}
                            {" • "}
                            {service.duration} min
                          </p>

                          {disabled && (
                            <p className="mt-1 text-xs text-red-600">
                              {service.speciality
                                ? `Aucun employé actif pour la spécialité ${SPECIALITY_LABELS[service.speciality]}`
                                : "Aucun employé actif disponible"}
                            </p>
                          )}
                        </div>

                        {isActive && (
                          <div
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-full
                              bg-(--cream)
                              text-(--black)
                              "
                          >
                            <Check size={17} />
                          </div>
                        )}
                      </button>

                      {isActive && (
                        <div
                          className="
                          mt-4
                          "
                        >
                          <label
                            className="
                            text-xs
                            "
                          >
                            Employé responsable
                          </label>

                          {(() => {
                            const eligibleEmployees =
                              eligibleEmployeesFor(service);

                            if (eligibleEmployees.length === 0) {
                              return (
                                <p className="mt-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
                                  {service.speciality
                                    ? `Aucun employé pour la spécialité ${SPECIALITY_LABELS[service.speciality]}`
                                    : "Aucun employé disponible"}
                                </p>
                              );
                            }

                            return (
                              <select
                                value={
                                  typeof item.employee === "string"
                                    ? item.employee
                                    : item.employee._id
                                }
                                onChange={(e) =>
                                  updateEmployee(service._id, e.target.value)
                                }
                                className="
                                mt-2
                                w-full
                                rounded-xl
                                bg-white
                                p-3
                                text-black
                                "
                              >
                                <option value="">Choisir un employé</option>

                                {eligibleEmployees.map((employee) => (
                                  <option
                                    key={employee._id}
                                    value={employee._id}
                                  >
                                    {employee.firstName} {employee.lastName}
                                  </option>
                                ))}
                              </select>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentServicesSelector;

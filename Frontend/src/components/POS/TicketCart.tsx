import { Receipt, Trash2 } from "lucide-react";

import type { Employee } from "../../types/employee";
import type { CartItem } from "../../hooks/usePOS";

type Props = {
  cart: CartItem[];
  employees: Employee[];
  removeItem: (index: number) => void;
  updateEmployee: (index: number, employee: Employee) => void;
  updatePrice: (index: number, price: number) => void;
};

const TicketCart = ({
  cart,
  employees,
  removeItem,
  updateEmployee,
  updatePrice,
}: Props) => {
  return (
    <section className="rounded-3xl border border-(--border) bg-white p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Ticket</h2>
        <Receipt />
      </div>

      <div className="mt-5 space-y-4">
        {!cart.length && (
          <p className="text-sm text-(--muted)">Aucun service ajouté</p>
        )}

        {cart.map((item, index) => (
          <div
            key={`${item.service._id}-${index}`}
            className="rounded-2xl border border-(--border) p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{item.service.name}</p>
                <p className="text-xs text-(--muted)">{item.duration} min</p>
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium">Employé responsable</label>

              <select
                value={item.employee?._id ?? ""}
                onChange={(e) => {
                  const employee = employees.find(
                    (emp) => emp._id === e.target.value,
                  );
                  if (employee) updateEmployee(index, employee);
                }}
                className="mt-2 w-full rounded-xl border border-(--border) p-3 outline-none"
              >
                <option value="">Choisir un employé</option>

                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName}
                    {employee.speciality && ` - ${employee.speciality}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium">Prix final</label>

              <input
                type="number"
                value={item.finalPrice}
                onChange={(e) => updatePrice(index, Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-(--border) p-3 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketCart;

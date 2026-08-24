import type { DashboardData } from "../../api/dashboard.api";
import { formatMoney as money } from "../../config/currency";

interface TopEmployeesProps {
  data: DashboardData;
}

export default function TopEmployees({ data }: TopEmployeesProps) {
  return (
    <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6">
      <h2 className="mb-5 font-semibold">Performance employés</h2>

      <div className="space-y-3">
        {data.topEmployees?.length ? (
          data.topEmployees.map((employee) => (
            <div
              key={employee.employeeId}
              className="flex items-center justify-between rounded-2xl bg-[#f3f4f6] p-4"
            >
              <span className="font-semibold">{employee.name}</span>

              <span className="text-right text-sm">
                <p className="font-bold">{money(employee.revenue)}</p>

                <p className="text-gray-500">{employee.tickets} tickets</p>
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucun employé disponible</p>
        )}
      </div>
    </div>
  );
}

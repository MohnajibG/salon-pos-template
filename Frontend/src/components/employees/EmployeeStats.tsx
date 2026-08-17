import { Users, UserCheck, WalletCards } from "lucide-react";
import StatCard from "../ui/StatCard";
import type { Employee } from "../../types/employee";

const EmployeeStats = ({ employees }: { employees: Employee[] }) => {
  const total = employees.length;
  const active = employees.filter((e) => e.isActive).length;
  const cashiers = employees.filter((e) => e.role === "cashier").length;

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full *:h-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]">
        <StatCard
          icon={Users}
          title="Total employés"
          value={total}
          accent="black"
        />
      </div>
      <div className="w-full *:h-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]">
        <StatCard
          icon={UserCheck}
          title="Employés actifs"
          value={active}
          accent="success"
        />
      </div>
      <div className="w-full *:h-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]">
        <StatCard
          icon={WalletCards}
          title="Caissiers"
          value={cashiers}
          accent="gold"
        />
      </div>
    </div>
  );
};

export default EmployeeStats;

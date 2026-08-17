import { Navigate, Outlet } from "react-router-dom";

type Role = "admin" | "cashier" | "employee";

interface RoleRouteProps {
  allowedRoles: Role[];
}

interface StoredUser {
  id: string;
  role: Role;
}

const dashboardByRole: Record<Role, string> = {
  admin: "/admin/dashboard",
  cashier: "/cashier/dashboard",
  employee: "/employee/dashboard",
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/app" replace />;
  }

  let user: StoredUser;

  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.clear();

    return <Navigate to="/app" replace />;
  }

  const role = user.role;

  if (!role || !dashboardByRole[role]) {
    localStorage.clear();

    return <Navigate to="/app" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={dashboardByRole[role]} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;

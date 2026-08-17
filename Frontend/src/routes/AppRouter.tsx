import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Public
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ChangePassword from "../pages/auth/ChangePassword";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import CashierLayout from "../layouts/CashierLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import Clients from "../pages/admin/Clients";
import Employees from "../pages/admin/Employees";
import Categories from "../pages/admin/Categories";
import Services from "../pages/admin/Services";
import Appointments from "../pages/Appointments";
import Tickets from "../pages/admin/ticket";
import CashRegisterHistory from "../pages/admin/CashRegisterHistory";
import Waitlist from "../pages/admin/Waitlist";
import Settings from "../pages/admin/Settings";

// Cashier pages
import CashierDashboard from "../pages/cashier/Dashboard";
import POS from "../pages/cashier/POS";
import Customers from "../pages/cashier/Customers";
import CashierTickets from "../pages/cashier/Tickets";
import CashierProfile from "../pages/cashier/Profile";

// Employee pages
import EmployeeDashboard from "../pages/employee/Dashboard";
import MyAppointments from "../pages/employee/MyAppointments";
import EmployeeServices from "../pages/employee/Services";
import MyStatistics from "../pages/employee/MyStatistics";
import EmployeeProfile from "../pages/employee/Profile";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}

        <Route path="/" element={<Home />} />

        <Route path="/app" element={<Login />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]} />
            </ProtectedRoute>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="employees" element={<Employees />} />
            <Route path="categories" element={<Categories />} />
            <Route path="cash-register" element={<CashRegisterHistory />} />
            <Route path="services" element={<Services />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="waitlist" element={<Waitlist />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* CASHIER */}

        <Route
          path="/cashier"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["cashier"]} />
            </ProtectedRoute>
          }
        >
          <Route element={<CashierLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<CashierDashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="pos" element={<POS />} />
            <Route path="tickets" element={<CashierTickets />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="waitlist" element={<Waitlist />} />
            <Route path="profile" element={<CashierProfile />} />
          </Route>
        </Route>

        {/* EMPLOYEE */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["employee"]} />
            </ProtectedRoute>
          }
        >
          <Route element={<EmployeeLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="services" element={<EmployeeServices />} />
            <Route path="statistics/:month" element={<MyStatistics />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
        </Route>

        {/* 404 */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

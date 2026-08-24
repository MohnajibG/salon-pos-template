import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const links = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    path: "/employee/dashboard",
  },
  {
    label: "Mes prestations",
    icon: Briefcase,
    path: "/employee/services",
  },
  {
    label: "Mes rendez-vous",
    icon: CalendarDays,
    path: "/employee/appointments",
  },
  {
    label: "Mes statistiques",
    icon: BarChart3,
    path: "/employee/statistics",
  },
  {
    label: "Mon profil",
    icon: User,
    path: "/employee/profile",
  },
];

const months = ["2026-01", "2026-02", "2026-03", "2026-04"];

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [openStats, setOpenStats] = useState(
    location.pathname.includes("statistics"),
  );

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/app");
  };

  const active = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="role-employee flex min-h-screen bg-(--cream)">
      {/* MOBILE HEADER */}
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-(--role-shell-border) bg-(--role-shell-bg) px-5 md:hidden">
        <div>
          <h1 className="font-title text-xl tracking-widest text-(--role-shell-text)">
            SALONPRO
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-(--role-shell-accent)">
            COMMERCE
          </p>
        </div>

        <button
          onClick={logout}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--role-shell-accent) text-(--role-shell-accent-text)"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-(--role-shell-border) bg-(--role-shell-bg) md:hidden">
        {links.map(({ path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
              active(path)
                ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)"
                : "text-(--role-shell-text)"
            }`}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>

      {/* TABLET SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-20 flex-col items-center border-r border-(--role-shell-border) bg-(--role-shell-bg) py-6 md:flex lg:hidden">
        <h1 className="mb-8 font-title text-xl text-(--role-shell-text)">
          SP
        </h1>

        <nav className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {links.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              title={label}
              onClick={() => navigate(path)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                active(path)
                  ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)"
                  : "text-(--role-shell-text)/70 hover:bg-black/5"
              }`}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 hidden h-screen flex-col border-r border-(--role-shell-border) bg-(--role-shell-bg) text-(--role-shell-text) transition-all duration-300 lg:flex ${
          collapsed ? "w-24" : "w-72"
        }`}
      >
        <div className="relative border-b border-(--role-shell-border) p-6">
          <h1 className="font-title text-2xl tracking-[3px]">
            {collapsed ? "SP" : "SALONPRO"}
          </h1>

          {!collapsed && (
            <>
              <p className="text-xs tracking-[4px] text-(--role-shell-text)/60">
                COMMERCE
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[2px] text-(--role-shell-accent)">
                EMPLOYÉ
              </p>
            </>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-(--role-shell-border) bg-(--role-shell-bg) text-(--role-shell-text)"
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          {links.map(({ label, icon: Icon, path }) => {
            if (label === "Mes statistiques") {
              return (
                <div key={path} className="flex flex-col">
                  <button
                    onClick={() => {
                      if (collapsed) {
                        navigate(path);
                        return;
                      }
                      setOpenStats(!openStats);
                    }}
                    className={`flex items-center rounded-xl transition ${
                      collapsed ? "justify-center py-3" : "justify-between px-4 py-3"
                    } text-sm ${
                      active(path)
                        ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)"
                        : "text-(--role-shell-text)/70 hover:bg-black/5"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {!collapsed && label}
                    </span>

                    {!collapsed && (
                      <ChevronDown
                        size={16}
                        className={
                          openStats ? "rotate-180 transition" : "transition"
                        }
                      />
                    )}
                  </button>

                  {!collapsed && openStats && (
                    <div className="ml-6 mt-2 flex flex-col gap-1">
                      {months.map((month) => (
                        <button
                          key={month}
                          onClick={() =>
                            navigate(`/employee/statistics/${month}`)
                          }
                          className="w-full rounded-lg px-3 py-2 text-left text-xs text-(--role-shell-text)/60 hover:bg-black/5"
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center rounded-xl text-sm transition ${
                  collapsed ? "justify-center py-3" : "gap-3 px-4 py-3"
                } ${
                  active(path)
                    ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)"
                    : "text-(--role-shell-text)/70 hover:bg-black/5"
                }`}
              >
                <Icon size={18} />
                {!collapsed && label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-(--role-shell-border) p-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600"
          >
            <LogOut size={18} />
            {!collapsed && "Déconnexion"}
          </button>
        </div>
      </aside>

      <main
        className={`min-h-screen w-full flex-1 pt-20 pb-24 md:ml-20 md:pt-6 lg:pb-6 ${
          collapsed ? "lg:ml-24" : "lg:ml-72"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;

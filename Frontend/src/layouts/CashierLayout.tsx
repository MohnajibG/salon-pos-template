import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MoreHorizontal,
  Receipt,
  ShoppingCart,
  UserRound,
  Users,
  X,
} from "lucide-react";

const links = [
  { label: "Tableau de bord", icon: LayoutDashboard, path: "/cashier/dashboard" },
  { label: "Point de vente", icon: ShoppingCart, path: "/cashier/pos" },
  { label: "Clients", icon: Users, path: "/cashier/customers" },
  { label: "Rendez-vous", icon: CalendarDays, path: "/cashier/appointments" },
  { label: "Liste d'attente", icon: ListTodo, path: "/cashier/waitlist" },
  { label: "Tickets", icon: Receipt, path: "/cashier/tickets" },
  { label: "Profil", icon: UserRound, path: "/cashier/profile" },
];

const CashierLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/app");
  };

  const active = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="role-cashier flex min-h-screen bg-(--cream)">
      {/* MOBILE HEADER */}
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-(--role-shell-border) bg-(--role-shell-bg) px-5 md:hidden">
        <div>
          <h1 className="font-title text-xl tracking-widest text-(--role-shell-text)">
            FLOWDESK
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-(--role-shell-accent)">
            COMMERCE
          </p>
          <p className="text-xs text-(--role-shell-text)/60">
            {user.firstName || "Caissier"}
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
        {links.slice(0, 4).map(({ path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${active(path) ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)" : "text-(--role-shell-text)"}`}
          >
            <Icon size={20} />
          </button>
        ))}

        <button
          onClick={() => setShowMore(true)}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
            links.slice(4).some(({ path }) => active(path))
              ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)"
              : "text-(--role-shell-text)"
          }`}
        >
          <MoreHorizontal size={20} />
        </button>
      </nav>

      {/* MOBILE "PLUS" SHEET */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[75vh] flex-col rounded-t-3xl bg-(--role-shell-bg) p-4 md:hidden"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <h2 className="font-title text-lg font-bold text-(--role-shell-text)">
                  Menu
                </h2>
                <button
                  onClick={() => setShowMore(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-(--role-shell-text)"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto">
                {links.map(({ path, icon: Icon, label }) => (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setShowMore(false);
                    }}
                    className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active(path)
                        ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)"
                        : "text-(--role-shell-text)/70 hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}

                <button
                  onClick={logout}
                  className="mt-2 flex items-center gap-4 rounded-xl bg-red-500/20 px-4 py-3 text-sm font-medium text-red-300"
                >
                  <LogOut size={20} />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TABLET SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-20 flex-col items-center border-r border-(--role-shell-border) bg-(--role-shell-bg) py-6 md:flex lg:hidden">
        <h1 className="mb-8 font-title text-xl text-(--role-shell-text)">FD</h1>

        <nav className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {links.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              title={label}
              onClick={() => navigate(path)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${active(path) ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)" : "text-(--role-shell-text) hover:bg-white/10"}`}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/20 text-red-300"
        >
          <LogOut size={18} />
        </button>
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 hidden h-screen flex-col border-r border-(--role-shell-border) bg-(--role-shell-bg) transition-all duration-300 lg:flex ${collapsed ? "w-24" : "w-72"}`}
      >
        <div className="relative border-b border-(--role-shell-border) p-6">
          <h1 className="font-title text-2xl tracking-widest text-(--role-shell-text)">
            {collapsed ? "FD" : "FLOWDESK"}
          </h1>

          {!collapsed && (
            <>
              <p className="mt-2 text-[11px] tracking-[0.45em] text-(--role-shell-accent)">
                COMMERCE
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-(--role-shell-text)/60">
                CAISSIER
              </p>
              <p className="mt-2 text-sm text-(--role-shell-text)/70">
                {user.firstName} {user.lastName}
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
          {links.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center rounded-xl transition ${collapsed ? "justify-center py-3" : "gap-4 px-4 py-3"} ${active(path) ? "bg-(--role-shell-accent) text-(--role-shell-accent-text)" : "text-(--role-shell-text)/70 hover:bg-white/10"}`}
            >
              <Icon size={20} />

              {!collapsed && <span className="text-sm">{label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="m-4 flex items-center justify-center gap-3 rounded-xl bg-(--role-shell-accent) py-3 text-(--role-shell-accent-text)"
        >
          <LogOut size={18} />

          {!collapsed && "Déconnexion"}
        </button>
      </aside>

      {/* CONTENT */}
      <main
        className={`min-h-screen w-full flex-1 pt-20 pb-24 md:ml-20 md:pt-6 lg:pb-6 ${collapsed ? "lg:ml-24" : "lg:ml-72"}`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CashierLayout;

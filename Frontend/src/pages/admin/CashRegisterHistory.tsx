import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleCheckBig,
  ChevronDown,
  ChevronUp,
  Download,
  HandCoins,
  Lock,
  Pencil,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  Trash2,
  TrendingDown,
  TrendingUp,
  Unlock,
} from "lucide-react";

import {
  getCashRegisterHistory,
  adminOpenCashRegister,
  adminCloseCashRegister,
  finalizeCashRegister,
} from "../../api/cashRegister.api";
import { getTickets } from "../../api/ticket.api";
import { getExpenses, deleteExpense } from "../../api/expense.api";
import { getEmployees } from "../../api/employee.api";
import type { CashRegister } from "../../types/cashRegister";
import type { Ticket } from "../../types/ticket";
import type { Expense } from "../../types/expense";
import type { Employee } from "../../types/employee";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import AddExpenseModal from "../../components/expenses/AddExpenseModal";
import CloseRegisterModal from "../../components/POS/CloseRegisterModal";
import AdminOpenRegisterModal from "../../components/cashRegister/AdminOpenRegisterModal";
import EditTicketModal from "../../components/ticket/EditTicketModal";

const CashRegisterHistory = () => {
  const [history, setHistory] = useState<CashRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "open" | "closed" | "finalized">("all");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ticketsByRegister, setTicketsByRegister] = useState<
    Record<string, Ticket[]>
  >({});
  const [loadingTickets, setLoadingTickets] = useState<
    Record<string, boolean>
  >({});
  const [ticketsError, setTicketsError] = useState<Record<string, string>>(
    {},
  );

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [expensesError, setExpensesError] = useState("");
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const loadExpenses = useCallback(async () => {
    try {
      setLoadingExpenses(true);
      setExpensesError("");
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("[CashRegisterHistory] getExpenses:", err);
      setExpensesError("Impossible de charger les charges");
    } finally {
      setLoadingExpenses(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm("Supprimer cette charge ?")) return;

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err) {
      console.error("[CashRegisterHistory] deleteExpense:", err);
      setExpensesError("Impossible de supprimer cette charge");
    }
  };

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const toggleExpand = async (registerId: string) => {
    if (expandedId === registerId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(registerId);

    if (ticketsByRegister[registerId]) return;

    setLoadingTickets((prev) => ({ ...prev, [registerId]: true }));
    setTicketsError((prev) => ({ ...prev, [registerId]: "" }));

    try {
      const data = await getTickets({ cashRegister: registerId });
      setTicketsByRegister((prev) => ({ ...prev, [registerId]: data }));
    } catch (err) {
      console.error("[CashRegisterHistory] getTickets:", err);
      setTicketsError((prev) => ({
        ...prev,
        [registerId]: "Impossible de charger les ventes de cette caisse",
      }));
    } finally {
      setLoadingTickets((prev) => ({ ...prev, [registerId]: false }));
    }
  };

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCashRegisterHistory(
        status !== "all" ? { status } : undefined,
      );
      setHistory(data);
    } catch (err) {
      console.error("[CashRegisterHistory]", err);
      setError("Impossible de charger l'historique des caisses");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const [cashiers, setCashiers] = useState<Employee[]>([]);
  const [showAdminOpenModal, setShowAdminOpenModal] = useState(false);
  const [adminCloseTarget, setAdminCloseTarget] = useState<CashRegister | null>(
    null,
  );
  const [adminCloseLoading, setAdminCloseLoading] = useState(false);
  const [adminCloseError, setAdminCloseError] = useState("");
  const [finalizeTarget, setFinalizeTarget] = useState<CashRegister | null>(
    null,
  );
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [finalizeError, setFinalizeError] = useState("");
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const loadCashiers = async () => {
      try {
        const data = await getEmployees({ role: "cashier" });
        setCashiers(data);
      } catch (err) {
        console.error("[CashRegisterHistory] getEmployees:", err);
      }
    };
    loadCashiers();
  }, []);

  const handleAdminOpen = async (cashierId: string, openingAmount: number) => {
    await adminOpenCashRegister({ cashier: cashierId, openingAmount });
    await loadHistory();
  };

  const handleAdminClose = async (closingAmount: number, notes?: string) => {
    if (!adminCloseTarget) return;

    try {
      setAdminCloseLoading(true);
      setAdminCloseError("");
      await adminCloseCashRegister(adminCloseTarget._id, {
        closingAmount,
        notes,
      });
      setAdminCloseTarget(null);
      await loadHistory();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Impossible de fermer cette caisse";
      setAdminCloseError(message);
      throw err;
    } finally {
      setAdminCloseLoading(false);
    }
  };

  const handleFinalize = async (finalAmount: number, notes?: string) => {
    if (!finalizeTarget) return;

    try {
      setFinalizeLoading(true);
      setFinalizeError("");
      await finalizeCashRegister(finalizeTarget._id, { finalAmount, notes });
      setFinalizeTarget(null);
      await loadHistory();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Impossible de finaliser cette caisse";
      setFinalizeError(message);
      throw err;
    } finally {
      setFinalizeLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    const query = search.toLowerCase();
    return history.filter((item) => {
      const cashierName =
        typeof item.cashier === "object"
          ? `${item.cashier.firstName} ${item.cashier.lastName}`.toLowerCase()
          : "";
      return cashierName.includes(query) || item.date.includes(query);
    });
  }, [history, search]);

  const totalRevenue = useMemo(
    () =>
      history.reduce(
        (sum, item) =>
          sum + item.totals.cash + item.totals.card + item.totals.transfer,
        0,
      ),
    [history],
  );

  const exportCSV = () => {
    const headers = [
      "Date",
      "Caissier",
      "Statut",
      "Fond ouverture",
      "Espèces",
      "Carte",
      "Virement",
      "Tickets",
      "Comptage réel",
      "Attendu",
      "Écart",
    ];

    const rows = filteredHistory.map((item) => {
      const cashierName =
        typeof item.cashier === "object"
          ? `${item.cashier.firstName} ${item.cashier.lastName}`
          : "";
      return [
        item.date,
        cashierName,
        item.status === "open" ? "Ouverte" : "Fermée",
        item.openingAmount,
        item.totals.cash,
        item.totals.card,
        item.totals.transfer,
        item.totals.ticketsCount,
        item.closingAmount ?? "",
        item.expectedAmount ?? "",
        item.difference ?? "",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(";"))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `historique-caisses-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-(--muted)">
        Chargement de l'historique des caisses...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-(--brown)">
            Administration
          </p>
          <h1 className="mt-3 font-title text-3xl font-bold text-(--black)">
            Historique des caisses
          </h1>
          <p className="mt-2 text-sm text-(--muted)">
            Suivi des ouvertures/fermetures de caisse par journée
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAdminOpenModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-(--border) px-5 py-3 text-(--black) transition hover:bg-(--cream)"
          >
            <Unlock size={18} />
            Ouvrir pour un caissier
          </button>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-(--border) px-5 py-3 text-(--black) transition hover:bg-(--cream)"
          >
            <Plus size={18} />
            Ajouter une charge
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)"
          >
            <Download size={18} />
            Exporter CSV
          </button>
        </div>
      </section>


      <div className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(33.333%-10.667px)]">
          <StatCard icon={Receipt} title="Sessions" value={history.length} />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(33.333%-10.667px)]">
          <StatCard
            icon={HandCoins}
            title="Total encaissé"
            value={`${totalRevenue} DA`}
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(33.333%-10.667px)]">
          <StatCard
            icon={Unlock}
            title="Caisses ouvertes"
            value={history.filter((h) => h.status === "open").length}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <div className="flex flex-col gap-3 rounded-3xl border border-(--border) bg-white p-5 md:flex-row">
        <div className="flex flex-1 items-center gap-3">
          <Search size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par caissier ou date..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "all" | "open" | "closed" | "finalized")
          }
          className="rounded-xl border border-(--border) px-4 py-2"
        >
          <option value="all">Tous les statuts</option>
          <option value="open">Ouvertes</option>
          <option value="closed">Fermées</option>
          <option value="finalized">Finalisées</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--border) bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left">
            <thead className="border-b border-(--border) bg-(--surface)">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-sm font-semibold">Caissier</th>
                <th className="px-6 py-4 text-sm font-semibold">Fond</th>
                <th className="px-6 py-4 text-sm font-semibold">Espèces</th>
                <th className="px-6 py-4 text-sm font-semibold">Carte</th>
                <th className="px-6 py-4 text-sm font-semibold">Virement</th>
                <th className="px-6 py-4 text-sm font-semibold">Écart</th>
                <th className="px-6 py-4 text-sm font-semibold">Statut</th>
                <th className="px-6 py-4 text-sm font-semibold">
                  Actions admin
                </th>
                <th className="px-6 py-4 text-sm font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => {
                const cashierName =
                  typeof item.cashier === "object"
                    ? `${item.cashier.firstName} ${item.cashier.lastName}`
                    : "-";
                const isExpanded = expandedId === item._id;
                const tickets = ticketsByRegister[item._id] ?? [];

                return (
                  <Fragment key={item._id}>
                    <tr
                      onClick={() => toggleExpand(item._id)}
                      className="cursor-pointer border-b border-(--border) transition hover:bg-(--surface) last:border-none"
                    >
                      <td className="px-6 py-4 font-semibold">{item.date}</td>
                      <td className="px-6 py-4">{cashierName}</td>
                      <td className="px-6 py-4">{item.openingAmount} DA</td>
                      <td className="px-6 py-4">{item.totals.cash} DA</td>
                      <td className="px-6 py-4">{item.totals.card} DA</td>
                      <td className="px-6 py-4">{item.totals.transfer} DA</td>
                      <td className="px-6 py-4">
                        {item.difference === undefined ? (
                          "-"
                        ) : item.difference === 0 ? (
                          <span className="text-green-600">Juste</span>
                        ) : item.difference > 0 ? (
                          <span className="flex items-center gap-1 text-blue-600">
                            <TrendingUp size={14} />+{item.difference} DA
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600">
                            <TrendingDown size={14} />
                            {item.difference} DA
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              item.status === "open"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "finalized"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-(--surface) text-(--muted)"
                            }`}
                          >
                            {item.status === "open" ? (
                              <Unlock size={12} />
                            ) : item.status === "finalized" ? (
                              <ShieldCheck size={12} />
                            ) : (
                              <Lock size={12} />
                            )}
                            {item.status === "open"
                              ? "Ouverte"
                              : item.status === "finalized"
                                ? "Finalisée"
                                : "Fermée"}
                          </span>

                          {item.autoClosed && (
                            <span className="w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              Auto-fermée
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === "open" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAdminCloseTarget(item);
                            }}
                            className="flex items-center gap-1.5 rounded-xl border border-(--border) px-3 py-2 text-xs font-semibold transition hover:bg-(--cream)"
                          >
                            <Lock size={14} />
                            Fermer
                          </button>
                        )}

                        {item.status === "closed" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFinalizeTarget(item);
                            }}
                            className="flex items-center gap-1.5 rounded-xl border border-(--border) px-3 py-2 text-xs font-semibold transition hover:bg-(--cream)"
                          >
                            <CircleCheckBig size={14} />
                            Finaliser
                          </button>
                        )}

                        {item.status === "finalized" && (
                          <span className="text-xs text-(--muted)">
                            Verrouillée
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-(--muted)">
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-(--border) last:border-none">
                        <td colSpan={10} className="bg-(--surface) px-6 py-5">
                          {loadingTickets[item._id] && (
                            <p className="text-sm text-(--muted)">
                              Chargement des ventes...
                            </p>
                          )}

                          {ticketsError[item._id] && (
                            <p className="text-sm text-red-600">
                              {ticketsError[item._id]}
                            </p>
                          )}

                          {!loadingTickets[item._id] &&
                            !ticketsError[item._id] &&
                            !tickets.length && (
                              <p className="text-sm text-(--muted)">
                                Aucune vente enregistrée pour cette caisse.
                              </p>
                            )}

                          {!loadingTickets[item._id] && tickets.length > 0 && (
                            <div className="space-y-2">
                              {tickets.map((ticket) => {
                                const client =
                                  typeof ticket.client === "object"
                                    ? ticket.client
                                    : null;

                                return (
                                  <div
                                    key={ticket._id}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-(--border) bg-white p-4"
                                  >
                                    <div>
                                      <p className="font-semibold">
                                        {ticket.ticketNumber}
                                      </p>
                                      <p className="text-xs text-(--muted)">
                                        {client
                                          ? `${client.firstName} ${client.lastName}`
                                          : "-"}{" "}
                                        ·{" "}
                                        {new Date(
                                          ticket.createdAt,
                                        ).toLocaleTimeString("fr-FR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-xs capitalize text-(--muted)">
                                        {ticket.paymentMethod}
                                      </span>
                                      <Badge
                                        variant={
                                          ticket.status === "paid"
                                            ? "success"
                                            : "danger"
                                        }
                                      >
                                        {ticket.status === "paid"
                                          ? "Payé"
                                          : "Annulé"}
                                      </Badge>
                                      <span className="font-semibold">
                                        {ticket.total} DA
                                      </span>

                                      {ticket.status === "paid" &&
                                        item.status !== "finalized" && (
                                          <button
                                            onClick={() =>
                                              setEditingTicket(ticket)
                                            }
                                            aria-label="Modifier"
                                            className="rounded-xl border border-(--border) p-2 transition hover:bg-(--cream)"
                                          >
                                            <Pencil size={14} />
                                          </button>
                                        )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {!filteredHistory.length && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-(--muted)"
                  >
                    Aucune session de caisse trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-(--border) bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-title text-xl font-bold text-(--black)">
              Charges variables & semi-variables
            </h2>
            <p className="mt-1 text-sm text-(--muted)">
              Achats de produits, fournitures et autres dépenses courantes
            </p>
          </div>

          <Badge variant="neutral">{totalExpenses} DA au total</Badge>
        </div>

        {expensesError && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-red-600">
            {expensesError}
          </div>
        )}

        <div className="mt-5 space-y-2">
          {loadingExpenses && (
            <p className="text-sm text-(--muted)">Chargement des charges...</p>
          )}

          {!loadingExpenses && !expenses.length && (
            <p className="text-sm text-(--muted)">
              Aucune charge enregistrée pour l'instant.
            </p>
          )}

          {!loadingExpenses &&
            expenses.map((expense) => {
              const creator =
                typeof expense.createdBy === "object"
                  ? expense.createdBy
                  : null;

              return (
                <div
                  key={expense._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--border) p-4"
                >
                  <div>
                    <p className="font-semibold">{expense.description}</p>
                    <p className="text-xs text-(--muted)">
                      {new Date(expense.date).toLocaleDateString("fr-FR")}
                      {creator &&
                        ` · ${creator.firstName} ${creator.lastName}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        expense.type === "variable" ? "warning" : "info"
                      }
                    >
                      {expense.type === "variable"
                        ? "Variable"
                        : "Semi-variable"}
                    </Badge>

                    <span className="font-semibold">{expense.amount} DA</span>

                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      aria-label="Supprimer"
                      className="rounded-xl p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <AddExpenseModal
        open={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onCreated={loadExpenses}
      />

      <AdminOpenRegisterModal
        open={showAdminOpenModal}
        cashiers={cashiers}
        onClose={() => setShowAdminOpenModal(false)}
        onOpen={handleAdminOpen}
      />

      {adminCloseTarget && (
        <CloseRegisterModal
          register={adminCloseTarget}
          onClose={handleAdminClose}
          onCancel={() => {
            setAdminCloseTarget(null);
            setAdminCloseError("");
          }}
          loading={adminCloseLoading}
          error={adminCloseError}
        />
      )}

      {finalizeTarget && (
        <CloseRegisterModal
          register={finalizeTarget}
          onClose={handleFinalize}
          onCancel={() => {
            setFinalizeTarget(null);
            setFinalizeError("");
          }}
          loading={finalizeLoading}
          error={finalizeError}
          title="Finalisation de la caisse"
          subtitle={`Verrouillage définitif — ${finalizeTarget.date}`}
          amountLabel="Recomptage final (DA)"
          submitLabel="Finaliser définitivement"
          loadingLabel="Finalisation..."
          showPreviousClose
        />
      )}

      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onSaved={(updated) => {
            setTicketsByRegister((prev) => {
              const next: typeof prev = {};
              for (const key of Object.keys(prev)) {
                next[key] = prev[key].map((t) =>
                  t._id === updated._id ? updated : t,
                );
              }
              return next;
            });
            setEditingTicket(null);
            loadHistory();
          }}
        />
      )}
    </div>
  );
};

export default CashRegisterHistory;

// src/pages/admin/Appointments.tsx

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Check,
  X,
  CircleCheck,
  Trash2,
  Repeat,
  List,
  CalendarRange,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  cancelRecurrenceSeries,
} from "../api/appointment.api";
import { getWaitlistMatches } from "../api/waitlist.api";

import { useAuth } from "../hooks/useAuth";
import type { Appointment, AppointmentStatus } from "../types/appointment";

import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentDetailPanel from "../components/appointments/AppointmentDetailPanel";
import CalendarView from "../components/calendar/CalendarView";

import { getServices } from "../api/service.api";
import { getEmployees } from "../api/employee.api";

import type { Service } from "../types/service";
import type { Employee } from "../types/employee";
import { CURRENCY_LABEL } from "../config/currency";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  in_progress: "En cours",
  completed: "Terminé",
  waiting_payment: "Paiement attendu",
  paid: "Payé",
  cancelled: "Annulé",
  no_show: "Client absent",
};

const statusStyle: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  waiting_payment: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-stone-100 text-stone-700",
};

const moneyFormat = new Intl.NumberFormat("fr-FR");

const employeeNames = (appointment: Appointment) => {
  const names = appointment.services.map((service) =>
    typeof service.employee === "string"
      ? ""
      : `${service.employee.firstName} ${service.employee.lastName}`,
  );

  return Array.from(new Set(names.filter(Boolean))).join(", ");
};

const Appointments = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formPrefill, setFormPrefill] = useState<{
    date?: string;
    startTime?: string;
    employeeId?: string;
  }>({});
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );

  const [displayMode, setDisplayMode] = useState<"list" | "calendar">("list");

  const userId = user?._id;
  const isEmployee = user?.role === "employee";
  const canDelete = user?.role === "admin" || user?.role === "cashier";

  const refreshAppointments = useCallback(async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Erreur chargement rendez-vous:", error);
    }
  }, []);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);

      await refreshAppointments();

      setLoading(false);
    };

    loadAppointments();
  }, [refreshAppointments]);

  const filteredAppointments = useMemo(() => {
    const query = search.toLowerCase();

    return appointments.filter((appointment) => {
      if (isEmployee) {
        const assigned = appointment.services.some((service) =>
          typeof service.employee === "string"
            ? service.employee === userId
            : service.employee?._id === userId,
        );

        if (!assigned) return false;
      }

      const client =
        typeof appointment.client === "string"
          ? ""
          : `${appointment.client.firstName} ${appointment.client.lastName}`.toLowerCase();

      const phone =
        typeof appointment.client === "string"
          ? ""
          : (appointment.client.phone ?? "");

      const matchesSearch = client.includes(query) || phone.includes(search);

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter, isEmployee, userId]);

  const loadFormData = useCallback(async () => {
    try {
      const [servicesData, employeesData] = await Promise.all([
        getServices(),
        getEmployees(),
      ]);

      setServices(servicesData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Erreur chargement formulaire rendez-vous:", error);
    }
  }, []);

  const handleCreateRequest = async (prefill: {
    date: string;
    startTime: string;
    employeeId?: string;
  }) => {
    await loadFormData();
    setFormPrefill(prefill);
    setShowForm(true);
  };

  const changeStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointment(id, { status });

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === id ? { ...appointment, status } : appointment,
        ),
      );
    } catch (error) {
      console.error("Erreur modification statut:", error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Annuler ce rendez-vous ?")) return;

    const target = appointments.find((appointment) => appointment._id === id);

    try {
      await cancelAppointment(id);

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment,
        ),
      );

      if (target) {
        try {
          const serviceIds = target.services.map((service) => service.service);

          const firstEmployee = target.services[0]?.employee;

          const employeeId =
            typeof firstEmployee === "string"
              ? firstEmployee
              : firstEmployee?._id;

          const matches = await getWaitlistMatches({
            date: target.date,
            employee: employeeId,
            services: serviceIds,
          });

          if (matches.length > 0) {
            toast(
              `${matches.length} client(s) en liste d'attente pour ce créneau`,
              { icon: "⏳" },
            );
          }
        } catch (matchError) {
          console.error("Erreur recherche liste d'attente:", matchError);
        }
      }
    } catch (error) {
      console.error("Erreur annulation:", error);
    }
  };

  const handleCancelSeries = async (recurrenceGroupId: string) => {
    if (!confirm("Annuler toutes les prochaines occurrences de cette série ?"))
      return;

    try {
      const cancelled = await cancelRecurrenceSeries(recurrenceGroupId);
      const cancelledIds = new Set(cancelled.map((a) => a._id));

      setAppointments((current) =>
        current.map((appointment) =>
          cancelledIds.has(appointment._id)
            ? { ...appointment, status: "cancelled" }
            : appointment,
        ),
      );

      toast.success(`${cancelled.length} rendez-vous de la série annulés`);
    } catch (error) {
      console.error("Erreur annulation série:", error);
      toast.error("Erreur lors de l'annulation de la série");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement ce rendez-vous ?")) return;

    try {
      await deleteAppointment(id);

      setAppointments((current) =>
        current.filter((appointment) => appointment._id !== id),
      );
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-title text-3xl text-(--black)">Rendez-vous</h1>

          <p className="mt-1 text-sm text-stone-500">
            Gestion des réservations et suivi des prestations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-(--border) bg-white p-1">
            <button
              type="button"
              onClick={() => setDisplayMode("list")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                displayMode === "list"
                  ? "bg-(--black) text-(--cream)"
                  : "text-stone-600"
              }`}
            >
              <List size={16} />
              Liste
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode("calendar")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                displayMode === "calendar"
                  ? "bg-(--black) text-(--cream)"
                  : "text-stone-600"
              }`}
            >
              <CalendarRange size={16} />
              Calendrier
            </button>
          </div>

          <button
            onClick={async () => {
              await loadFormData();
              setFormPrefill({});
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-(--black) px-5 py-3 text-(--cream)"
          >
            <Plus size={18} />
            Nouveau
          </button>
        </div>
      </header>

      {displayMode === "calendar" && (
        <CalendarView
          canEdit={!isEmployee}
          onCreateRequest={!isEmployee ? handleCreateRequest : undefined}
        />
      )}

      {showForm && (
        <AppointmentForm
          services={services}
          employees={employees}
          initialDate={formPrefill.date}
          initialStartTime={formPrefill.startTime}
          initialEmployeeId={formPrefill.employeeId}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            refreshAppointments();
          }}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailPanel
          appointment={selectedAppointment}
          canEdit={!isEmployee}
          onClose={() => setSelectedAppointment(null)}
          onChanged={refreshAppointments}
        />
      )}

      {displayMode === "list" && (
        <>
          <div className="flex flex-col gap-3 rounded-3xl border border-(--border) bg-white p-5 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-(--cream) px-4">
              <Search size={18} />

              <input
                className="h-12 w-full bg-transparent outline-none"
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="h-12 rounded-2xl border border-(--border) px-4"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as AppointmentStatus | "all")
              }
            >
              <option value="all">Tous les rendez-vous</option>

              {Object.entries(statusLabels).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center">
              Chargement...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-stone-500">
              Aucun rendez-vous trouvé
            </div>
          ) : (
            <>
              {/* MOBILE / TABLETTE : cartes */}
              <div className="flex flex-col gap-3 md:hidden">
                {filteredAppointments.map((appointment) => (
                  <article
                    key={appointment._id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-(--border) bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-(--black)">
                          {appointment.date.slice(0, 10)} · {appointment.startTime}
                        </p>
                        <p className="mt-1 text-sm text-stone-600">
                          {typeof appointment.client !== "string" &&
                            `${appointment.client.firstName} ${appointment.client.lastName}`}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {appointment.recurrenceGroupId && (
                          <Repeat
                            size={14}
                            className="text-stone-400"
                            aria-label="Série récurrente"
                          />
                        )}

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[appointment.status]}`}
                        >
                          {statusLabels[appointment.status]}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-(--muted)">
                      {appointment.services.map((s) => s.name).join(", ")}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">
                        {employeeNames(appointment)}
                      </span>
                      <span className="font-semibold text-(--black)">
                        {moneyFormat.format(appointment.estimatedPrice)} {CURRENCY_LABEL}
                      </span>
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-wrap gap-1.5 border-t border-(--border) pt-3"
                    >
                      {(appointment.status === "pending" ||
                        appointment.status === "confirmed") && (
                        <button
                          title="Confirmer"
                          onClick={() =>
                            changeStatus(appointment._id, "confirmed")
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
                        >
                          <Check size={15} />
                        </button>
                      )}

                      <button
                        title="Terminer"
                        onClick={() =>
                          changeStatus(appointment._id, "completed")
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700"
                      >
                        <CircleCheck size={15} />
                      </button>

                      <button
                        title="Annuler"
                        onClick={() => handleCancel(appointment._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700"
                      >
                        <X size={15} />
                      </button>

                      {appointment.recurrenceGroupId && (
                        <button
                          title="Annuler la série"
                          onClick={() =>
                            handleCancelSeries(appointment.recurrenceGroupId!)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700"
                        >
                          <Repeat size={15} />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          title="Supprimer"
                          onClick={() => handleDelete(appointment._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* DESKTOP : tableau */}
              <div className="hidden overflow-x-auto rounded-3xl border border-(--border) bg-white md:block">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-(--border) text-xs uppercase tracking-wide text-stone-500">
                    <th className="px-4 py-3 font-medium">Date / Heure</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Prestation(s)</th>
                    <th className="px-4 py-3 font-medium">Employé(s)</th>
                    <th className="px-4 py-3 font-medium">Prix</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      onClick={() => setSelectedAppointment(appointment)}
                      className="cursor-pointer border-b border-(--border) last:border-none hover:bg-(--cream)/60"
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        {appointment.date.slice(0, 10)}
                        <br />
                        <span className="text-stone-500">
                          {appointment.startTime}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {typeof appointment.client !== "string" &&
                          `${appointment.client.firstName} ${appointment.client.lastName}`}
                      </td>

                      <td className="max-w-56 truncate px-4 py-3">
                        {appointment.services
                          .map((service) => service.name)
                          .join(", ")}
                      </td>

                      <td className="px-4 py-3">
                        {employeeNames(appointment)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        {moneyFormat.format(appointment.estimatedPrice)} {CURRENCY_LABEL}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {appointment.recurrenceGroupId && (
                            <Repeat
                              size={14}
                              className="text-stone-400"
                              aria-label="Série récurrente"
                            />
                          )}

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[appointment.status]}`}
                          >
                            {statusLabels[appointment.status]}
                          </span>
                        </div>
                      </td>

                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {(appointment.status === "pending" ||
                            appointment.status === "confirmed") && (
                            <button
                              title="Confirmer"
                              onClick={() =>
                                changeStatus(appointment._id, "confirmed")
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
                            >
                              <Check size={15} />
                            </button>
                          )}

                          <button
                            title="Terminer"
                            onClick={() =>
                              changeStatus(appointment._id, "completed")
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700"
                          >
                            <CircleCheck size={15} />
                          </button>

                          <button
                            title="Annuler"
                            onClick={() => handleCancel(appointment._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700"
                          >
                            <X size={15} />
                          </button>

                          {appointment.recurrenceGroupId && (
                            <button
                              title="Annuler la série"
                              onClick={() =>
                                handleCancelSeries(
                                  appointment.recurrenceGroupId!,
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700"
                            >
                              <Repeat size={15} />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              title="Supprimer"
                              onClick={() => handleDelete(appointment._id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default Appointments;

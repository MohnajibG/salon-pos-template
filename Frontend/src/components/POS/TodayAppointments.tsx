import { useEffect, useState } from "react";
import { CalendarClock, Clock, User } from "lucide-react";

import { getTodayAppointments } from "../../api/appointment.api";
import type { Appointment, AppointmentStatus } from "../../types/appointment";

type Props = {
  onSelect: (appointment: Appointment) => void;
};

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  in_progress: "En cours",
  completed: "Terminé",
  waiting_payment: "À encaisser",
  paid: "Payé",
  cancelled: "Annulé",
  no_show: "Absent",
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

const billableStatuses: AppointmentStatus[] = ["waiting_payment", "completed"];

const TodayAppointments = ({ onSelect }: Props) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTodayAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("[TodayAppointments]", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-(--border) bg-white p-5 text-sm text-(--muted)">
        Chargement des rendez-vous du jour...
      </section>
    );
  }

  if (!appointments.length) return null;

  return (
    <section className="rounded-3xl border border-(--border) bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <CalendarClock size={20} />
        <h2 className="font-semibold">
          Rendez-vous du jour ({appointments.length})
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {appointments.map((appointment) => {
          const client =
            typeof appointment.client === "object" ? appointment.client : null;
          const billable = billableStatuses.includes(appointment.status);

          return (
            <button
              key={appointment._id}
              type="button"
              disabled={!billable}
              onClick={() => billable && onSelect(appointment)}
              className={`flex items-center justify-between rounded-2xl p-4 text-left transition ${
                billable
                  ? "bg-(--surface) hover:bg-(--cream)"
                  : "cursor-not-allowed bg-(--surface)/60 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <User size={16} />
                  {client ? `${client.firstName} ${client.lastName}` : "Client"}
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-(--muted)">
                  <Clock size={13} />
                  {appointment.startTime} - {appointment.endTime}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[appointment.status]}`}
              >
                {statusLabels[appointment.status]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TodayAppointments;

import { CalendarClock, User } from "lucide-react";

import type { Appointment } from "../../types/appointment";
import { formatMoney } from "../../config/currency";

type Props = {
  appointments: Appointment[];
  selectAppointment: (appointment: Appointment) => void;
};

const WaitingAppointments = ({ appointments, selectAppointment }: Props) => {
  if (!appointments.length) return null;

  return (
    <section className="rounded-3xl border border-(--border) bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <CalendarClock size={20} />
        <h2 className="font-semibold">Rendez-vous en attente</h2>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <button
            key={appointment._id}
            type="button"
            onClick={() => selectAppointment(appointment)}
            className="flex w-full items-center justify-between rounded-2xl bg-(--surface) p-4 text-left hover:bg-(--cream)"
          >
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <User size={16} />
                {typeof appointment.client === "object"
                  ? `${appointment.client.firstName} ${appointment.client.lastName}`
                  : "Client"}
              </div>

              <p className="mt-1 text-sm text-(--muted)">
                {appointment.startTime} - {appointment.endTime}
              </p>
              <p className="text-xs text-(--muted)">
                {appointment.services.length} prestation(s)
              </p>
            </div>

            <div className="font-semibold">
              {formatMoney(appointment.estimatedPrice)}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default WaitingAppointments;

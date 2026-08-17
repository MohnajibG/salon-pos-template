import { useState } from "react";
import { X, Repeat, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  cancelRecurrenceSeries,
} from "../../api/appointment.api";

import type { Appointment, AppointmentStatus } from "../../types/appointment";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  in_progress: "En cours",
  completed: "Terminé",
  waiting_payment: "Paiement attendu",
  paid: "Payé",
  cancelled: "Annulé",
  no_show: "Client absent",
};

interface AppointmentDetailPanelProps {
  appointment: Appointment;
  canEdit: boolean;
  onClose: () => void;
  onChanged: () => void;
}

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof AxiosError
    ? (err.response?.data?.message ?? fallback)
    : fallback;

const AppointmentDetailPanel = ({
  appointment,
  canEdit,
  onClose,
  onChanged,
}: AppointmentDetailPanelProps) => {
  const [date, setDate] = useState(appointment.date.slice(0, 10));
  const [startTime, setStartTime] = useState(appointment.startTime);
  const [status, setStatus] = useState<AppointmentStatus>(appointment.status);
  const [notes, setNotes] = useState(appointment.notes ?? "");
  const [noShowReason, setNoShowReason] = useState(
    appointment.noShowReason ?? "",
  );
  const [saving, setSaving] = useState(false);

  const clientLabel =
    typeof appointment.client === "string"
      ? ""
      : `${appointment.client.firstName} ${appointment.client.lastName}`;

  const clientPhone =
    typeof appointment.client === "string" ? "" : appointment.client.phone;

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateAppointment(appointment._id, {
        date,
        startTime,
        status,
        notes,
        noShowReason: status === "no_show" ? noShowReason : undefined,
      });

      toast.success("Rendez-vous mis à jour");
      onChanged();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Impossible de modifier ce rendez-vous"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Annuler ce rendez-vous ?")) return;

    try {
      await cancelAppointment(appointment._id);
      toast.success("Rendez-vous annulé");
      onChanged();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Impossible d'annuler ce rendez-vous"));
    }
  };

  const handleCancelSeries = async () => {
    if (!appointment.recurrenceGroupId) return;
    if (!confirm("Annuler toutes les prochaines occurrences de cette série ?"))
      return;

    try {
      const cancelled = await cancelRecurrenceSeries(
        appointment.recurrenceGroupId,
      );
      toast.success(`${cancelled.length} rendez-vous de la série annulés`);
      onChanged();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Impossible d'annuler la série"));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer définitivement ce rendez-vous ?")) return;

    try {
      await deleteAppointment(appointment._id);
      toast.success("Rendez-vous supprimé");
      onChanged();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Impossible de supprimer ce rendez-vous"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            Rendez-vous
          </p>

          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            {clientLabel}
          </h2>

          {clientPhone && (
            <p className="mt-1 text-sm text-stone-500">{clientPhone}</p>
          )}

          {appointment.recurrenceGroupId && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
              <Repeat size={13} />
              Fait partie d'une série
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-col gap-2 rounded-2xl bg-(--cream) p-4 text-sm">
          {appointment.services.map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>
                {service.name}
                {" — "}
                {typeof service.employee === "string"
                  ? ""
                  : `${service.employee.firstName} ${service.employee.lastName}`}
              </span>
              <span className="font-semibold">{service.price} DA</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="md:flex-1">
            <label className="mb-2 block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              disabled={!canEdit}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4 disabled:opacity-60"
            />
          </div>

          <div className="md:flex-1">
            <label className="mb-2 block text-sm font-medium">Heure</label>
            <input
              type="time"
              value={startTime}
              disabled={!canEdit}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">Statut</label>
          <select
            value={status}
            disabled={!canEdit}
            onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4 disabled:opacity-60"
          >
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {status === "no_show" && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-amber-700">
              Motif de l'absence (optionnel)
            </label>
            <textarea
              rows={2}
              value={noShowReason}
              disabled={!canEdit}
              onChange={(e) => setNoShowReason(e.target.value)}
              placeholder="Ex : n'a pas répondu, contretemps signalé après coup..."
              className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 disabled:opacity-60"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">Notes</label>
          <textarea
            rows={3}
            value={notes}
            disabled={!canEdit}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-2xl border border-(--border) bg-(--cream) p-4 disabled:opacity-60"
          />
        </div>

        {canEdit && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-(--black) px-5 py-3 text-(--cream)"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>

            <button
              onClick={handleCancel}
              className="rounded-2xl bg-red-100 px-5 py-3 text-red-700"
            >
              Annuler le rdv
            </button>

            {appointment.recurrenceGroupId && (
              <button
                onClick={handleCancelSeries}
                className="flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-red-700"
              >
                <Repeat size={16} />
                Annuler la série
              </button>
            )}

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-2xl bg-stone-100 px-5 py-3 text-stone-700"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailPanel;

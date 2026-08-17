import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  getSchedule,
  updateWeeklyHours,
  addException,
  removeException,
} from "../../api/employeeSchedule.api";

import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type DayHours,
  type DayOfWeek,
  type EmployeeSchedule,
} from "../../types/employeeSchedule";

interface EmployeeScheduleModalProps {
  employeeId: string | null;
  onClose: () => void;
}

const EmployeeScheduleModal = ({
  employeeId,
  onClose,
}: EmployeeScheduleModalProps) => {
  const [schedule, setSchedule] = useState<EmployeeSchedule | null>(null);
  const [weeklyHours, setWeeklyHours] = useState<Record<
    DayOfWeek,
    DayHours
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [exceptionDate, setExceptionDate] = useState("");
  const [exceptionIsOff, setExceptionIsOff] = useState(true);
  const [exceptionStart, setExceptionStart] = useState("");
  const [exceptionEnd, setExceptionEnd] = useState("");
  const [exceptionReason, setExceptionReason] = useState("");

  useEffect(() => {
    if (!employeeId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getSchedule(employeeId);
        setSchedule(data);
        setWeeklyHours(data.weeklyHours);
      } catch (err) {
        console.error("Erreur chargement horaires:", err);
        toast.error("Impossible de charger les horaires");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [employeeId]);

  if (!employeeId) return null;

  const updateDay = (day: DayOfWeek, patch: Partial<DayHours>) => {
    setWeeklyHours((current) =>
      current
        ? {
            ...current,
            [day]: { ...current[day], ...patch },
          }
        : current,
    );
  };

  const handleSaveWeeklyHours = async () => {
    if (!weeklyHours) return;

    try {
      setSaving(true);
      const updated = await updateWeeklyHours(employeeId, weeklyHours);
      setSchedule(updated);
      toast.success("Horaires enregistrés");
    } catch (err) {
      console.error("Erreur enregistrement horaires:", err);
      toast.error("Impossible d'enregistrer les horaires");
    } finally {
      setSaving(false);
    }
  };

  const handleAddException = async () => {
    if (!exceptionDate) {
      toast.error("Veuillez choisir une date");
      return;
    }

    try {
      const updated = await addException(employeeId, {
        date: exceptionDate,
        isOff: exceptionIsOff,
        start: exceptionIsOff ? undefined : exceptionStart,
        end: exceptionIsOff ? undefined : exceptionEnd,
        reason: exceptionReason,
      });

      setSchedule(updated);
      setExceptionDate("");
      setExceptionIsOff(true);
      setExceptionStart("");
      setExceptionEnd("");
      setExceptionReason("");
    } catch (err) {
      console.error("Erreur ajout exception:", err);
      toast.error("Impossible d'ajouter l'exception");
    }
  };

  const handleRemoveException = async (exceptionId: string) => {
    try {
      const updated = await removeException(employeeId, exceptionId);
      setSchedule(updated);
    } catch (err) {
      console.error("Erreur suppression exception:", err);
      toast.error("Impossible de supprimer l'exception");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            Administration
          </p>
          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Horaires de travail
          </h2>
        </div>

        {loading || !weeklyHours ? (
          <div className="p-10 text-center text-stone-500">Chargement...</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex flex-col gap-2 rounded-2xl border border-(--border) p-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <label className="flex w-32 items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={weeklyHours[day].isOpen}
                      onChange={(event) =>
                        updateDay(day, { isOpen: event.target.checked })
                      }
                    />
                    {DAY_LABELS[day]}
                  </label>

                  {weeklyHours[day].isOpen ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="time"
                        value={weeklyHours[day].start ?? ""}
                        onChange={(event) =>
                          updateDay(day, { start: event.target.value })
                        }
                        className="h-10 flex-1 rounded-xl border border-(--border) px-3"
                      />
                      <span className="text-stone-400">à</span>
                      <input
                        type="time"
                        value={weeklyHours[day].end ?? ""}
                        onChange={(event) =>
                          updateDay(day, { end: event.target.value })
                        }
                        className="h-10 flex-1 rounded-xl border border-(--border) px-3"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-stone-400">Fermé</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveWeeklyHours}
              disabled={saving}
              className="rounded-2xl bg-(--black) px-6 py-3 text-(--cream)"
            >
              {saving ? "Enregistrement..." : "Enregistrer les horaires"}
            </button>

            <div className="border-t border-(--border) pt-6">
              <h3 className="mb-3 font-semibold">
                Exceptions (congés, horaires réduits)
              </h3>

              <div className="flex flex-col gap-2">
                {(schedule?.exceptions ?? []).map((exception) => (
                  <div
                    key={exception._id}
                    className="flex items-center justify-between rounded-xl bg-(--cream) px-4 py-3 text-sm"
                  >
                    <span>
                      {exception.date.slice(0, 10)} —{" "}
                      {exception.isOff
                        ? "Fermé"
                        : `${exception.start} à ${exception.end}`}
                      {exception.reason && ` (${exception.reason})`}
                    </span>

                    <button
                      onClick={() => handleRemoveException(exception._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {(schedule?.exceptions ?? []).length === 0 && (
                  <p className="text-sm text-stone-400">Aucune exception</p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <input
                  type="date"
                  value={exceptionDate}
                  onChange={(event) => setExceptionDate(event.target.value)}
                  className="h-10 w-full rounded-xl border border-(--border) px-3 sm:w-[calc(50%-6px)]"
                />

                <label className="flex w-full items-center gap-2 text-sm sm:w-[calc(50%-6px)]">
                  <input
                    type="checkbox"
                    checked={exceptionIsOff}
                    onChange={(event) =>
                      setExceptionIsOff(event.target.checked)
                    }
                  />
                  Journée complète fermée
                </label>

                {!exceptionIsOff && (
                  <>
                    <input
                      type="time"
                      value={exceptionStart}
                      onChange={(event) =>
                        setExceptionStart(event.target.value)
                      }
                      className="h-10 w-full rounded-xl border border-(--border) px-3 sm:w-[calc(50%-6px)]"
                      placeholder="Début"
                    />
                    <input
                      type="time"
                      value={exceptionEnd}
                      onChange={(event) => setExceptionEnd(event.target.value)}
                      className="h-10 w-full rounded-xl border border-(--border) px-3 sm:w-[calc(50%-6px)]"
                      placeholder="Fin"
                    />
                  </>
                )}

                <input
                  value={exceptionReason}
                  onChange={(event) => setExceptionReason(event.target.value)}
                  placeholder="Motif (optionnel)"
                  className="h-10 w-full rounded-xl border border-(--border) px-3"
                />
              </div>

              <button
                onClick={handleAddException}
                className="mt-3 flex items-center gap-2 rounded-xl border border-(--border) px-4 py-2 text-sm"
              >
                <Plus size={16} />
                Ajouter l'exception
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeScheduleModal;

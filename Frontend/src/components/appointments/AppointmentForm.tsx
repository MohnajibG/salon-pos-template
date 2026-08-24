// src/components/appointments/AppointmentForm.tsx

import { useCallback, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
  createAppointment,
  createRecurringAppointment,
} from "../../api/appointment.api";
import { useAuth } from "../../hooks/useAuth";

import type {
  AppointmentService,
  CreateAppointmentPayload,
  RecurrenceFrequency,
} from "../../types/appointment";

import type { Client } from "../../types/client";
import type { Employee } from "../../types/employee";
import type { Service } from "../../types/service";

import ClientAutocomplete from "./ClientAutocomplete";
import AppointmentServicesSelector from "./AppointmentServicesSelector";
import AppointmentSummary from "./AppointmentSummary";

// Formatage en heure locale du navigateur (pas toISOString, qui est en
// UTC et peut décaler le jour selon le fuseau horaire)
const toLocalDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toLocalTimeValue = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

interface AppointmentFormProps {
  services?: Service[];
  employees?: Employee[];
  initialDate?: string;
  initialStartTime?: string;
  initialEmployeeId?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

const AppointmentForm = ({
  services = [],
  employees = [],
  initialDate,
  initialStartTime,
  initialEmployeeId,
  onClose,
  onSuccess,
}: AppointmentFormProps) => {
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);

  const [selectedServices, setSelectedServices] = useState<
    AppointmentService[]
  >([]);

  const [todayLocal] = useState(() => toLocalDateValue(new Date()));

  const [date, setDate] = useState(initialDate ?? "");
  const [startTime, setStartTime] = useState(initialStartTime ?? "09:00");

  const [customPrice, setCustomPrice] = useState<number | undefined>();
  const [customDuration, setCustomDuration] = useState<number | undefined>();

  const [customEndTime, setCustomEndTime] = useState<string | undefined>();

  const [manualPrice, setManualPrice] = useState(false);
  const [manualDuration, setManualDuration] = useState(false);
  const [manualEndTime, setManualEndTime] = useState(false);

  const [notes, setNotes] = useState("");

  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>("weekly");
  const [recurrenceEndMode, setRecurrenceEndMode] = useState<
    "count" | "until"
  >("count");
  const [recurrenceCount, setRecurrenceCount] = useState(4);
  const [recurrenceUntil, setRecurrenceUntil] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const automaticValues = useMemo(
    () =>
      selectedServices.reduce(
        (total, service) => ({
          price: total.price + service.price,
          duration: total.duration + service.duration,
        }),
        {
          price: 0,
          duration: 0,
        },
      ),
    [selectedServices],
  );

  const totalDuration = manualDuration
    ? (customDuration ?? automaticValues.duration)
    : automaticValues.duration;

  const estimatedPrice = manualPrice
    ? (customPrice ?? automaticValues.price)
    : automaticValues.price;

  const calculateEndTime = useCallback((time: string, duration: number) => {
    const [hours, minutes] = time.split(":").map(Number);

    const totalMinutes = hours * 60 + minutes + duration;

    const endHours = Math.floor(totalMinutes / 60);

    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0",
    )}`;
  }, []);

  const endTime = useMemo(() => {
    if (manualEndTime) {
      return customEndTime ?? "";
    }

    if (!startTime || !totalDuration) {
      return "";
    }

    return calculateEndTime(startTime, totalDuration);
  }, [
    calculateEndTime,
    customEndTime,
    manualEndTime,
    startTime,
    totalDuration,
  ]);

  const resetForm = useCallback(() => {
    setClient(null);
    setSelectedServices([]);

    setDate("");
    setStartTime("09:00");

    setCustomPrice(undefined);
    setCustomDuration(undefined);
    setCustomEndTime(undefined);

    setManualPrice(false);
    setManualDuration(false);
    setManualEndTime(false);

    setNotes("");
    setError("");

    setIsRecurring(false);
    setFrequency("weekly");
    setRecurrenceEndMode("count");
    setRecurrenceCount(4);
    setRecurrenceUntil("");
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!client) {
        throw new Error("Veuillez sélectionner un client");
      }

      if (!user?._id) {
        throw new Error("Utilisateur non authentifié");
      }

      if (!date) {
        throw new Error("Veuillez sélectionner une date");
      }

      if (startTime && new Date(`${date}T${startTime}`) < new Date()) {
        throw new Error(
          "Impossible de prendre un rendez-vous dans le passé",
        );
      }

      if (!selectedServices.length) {
        throw new Error("Veuillez sélectionner au moins une prestation");
      }

      const missingEmployee = selectedServices.find(
        (service) => !service.employee,
      );

      if (missingEmployee) {
        throw new Error(
          `Veuillez choisir un employé pour "${missingEmployee.name}"`,
        );
      }

      const serviceItems = selectedServices.map((service) => ({
        service: service.service,

        employee:
          typeof service.employee === "string"
            ? service.employee
            : service.employee._id,

        name: service.name,

        price: service.price,

        duration: service.duration,
      }));

      if (isRecurring) {
        if (recurrenceEndMode === "count" && recurrenceCount < 1) {
          throw new Error("Le nombre d'occurrences doit être au moins 1");
        }

        if (recurrenceEndMode === "until" && !recurrenceUntil) {
          throw new Error("Veuillez choisir une date de fin de récurrence");
        }

        const result = await createRecurringAppointment({
          client: client._id,
          services: serviceItems,
          date,
          startTime,
          notes,
          source: "admin",
          recurrence: {
            frequency,
            count: recurrenceEndMode === "count" ? recurrenceCount : undefined,
            until: recurrenceEndMode === "until" ? recurrenceUntil : undefined,
          },
        });

        if (result.totalSkipped > 0) {
          const reasons: Record<string, string> = {
            employee_unavailable: "employé indisponible",
            outside_hours: "hors horaires",
            time_conflict: "créneau déjà pris",
            other: "conflit",
          };

          toast.error(
            `Série créée : ${result.totalCreated} rendez-vous créés, ${result.totalSkipped} ignorés (` +
              result.skipped
                .map((s) => `${s.date.slice(0, 10)} : ${reasons[s.reason]}`)
                .join(", ") +
              ")",
            { duration: 8000 },
          );
        } else {
          toast.success(`Série créée : ${result.totalCreated} rendez-vous`);
        }
      } else {
        const payload: CreateAppointmentPayload = {
          client: client._id,

          createdBy: user._id,

          services: serviceItems,

          date,

          startTime,

          endTime,

          totalDuration,

          estimatedPrice,

          notes,

          source: "admin",
        };

        await createAppointment(payload);
      }

      resetForm();

      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ??
            "Erreur lors de la création du rendez-vous",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const minTime = date === todayLocal ? toLocalTimeValue(new Date()) : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            Rendez-vous
          </p>

          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Nouveau rendez-vous
          </h2>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <ClientAutocomplete value={client} onChange={setClient} />

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="md:flex-1">
            <label className="mb-2 block text-sm font-medium">Date</label>

            <input
              type="date"
              value={date}
              min={todayLocal}
              onChange={(event) => setDate(event.target.value)}
              className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
            />
          </div>

          <div className="md:flex-1">
            <label className="mb-2 block text-sm font-medium">
              Heure début
            </label>

            <input
              type="time"
              value={startTime}
              min={minTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
            />
          </div>
        </div>

        <AppointmentServicesSelector
          services={services}
          employees={employees}
          selectedServices={selectedServices}
          onChange={setSelectedServices}
          defaultEmployeeId={initialEmployeeId}
        />

        <AppointmentSummary
          services={selectedServices}
          startTime={startTime}
          totalDuration={totalDuration}
          estimatedPrice={estimatedPrice}
          endTime={endTime}
          onDurationChange={(value) => {
            setManualDuration(true);
            setCustomDuration(value);
          }}
          onPriceChange={(value) => {
            setManualPrice(true);
            setCustomPrice(value);
          }}
          onEndTimeChange={(value) => {
            setManualEndTime(true);
            setCustomEndTime(value);
          }}
        />

        <textarea
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Ajouter une remarque..."
          className="rounded-2xl border border-(--border) bg-(--cream) p-4"
        />

        <div className="rounded-2xl border border-(--border) p-4">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(event) => setIsRecurring(event.target.checked)}
            />
            Répéter ce rendez-vous
          </label>

          {isRecurring && (
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="w-full md:w-[calc(50%-8px)]">
                <label className="mb-2 block text-sm font-medium">
                  Fréquence
                </label>

                <select
                  value={frequency}
                  onChange={(event) =>
                    setFrequency(event.target.value as RecurrenceFrequency)
                  }
                  className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
                >
                  <option value="weekly">Toutes les semaines</option>
                  <option value="biweekly">Toutes les 2 semaines</option>
                  <option value="monthly">Tous les mois</option>
                </select>
              </div>

              <div className="w-full md:w-[calc(50%-8px)]">
                <label className="mb-2 block text-sm font-medium">
                  Se termine
                </label>

                <select
                  value={recurrenceEndMode}
                  onChange={(event) =>
                    setRecurrenceEndMode(
                      event.target.value as "count" | "until",
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
                >
                  <option value="count">Après N occurrences</option>
                  <option value="until">À une date précise</option>
                </select>
              </div>

              {recurrenceEndMode === "count" ? (
                <div className="w-full md:w-[calc(50%-8px)]">
                  <label className="mb-2 block text-sm font-medium">
                    Nombre d'occurrences
                  </label>

                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={recurrenceCount}
                    onChange={(event) =>
                      setRecurrenceCount(Number(event.target.value))
                    }
                    className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
                  />
                </div>
              ) : (
                <div className="w-full md:w-[calc(50%-8px)]">
                  <label className="mb-2 block text-sm font-medium">
                    Jusqu'au
                  </label>

                  <input
                    type="date"
                    value={recurrenceUntil}
                    min={date || todayLocal}
                    onChange={(event) => setRecurrenceUntil(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="rounded-2xl border px-6 py-3"
          >
            Réinitialiser
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-(--black) px-6 py-3 text-(--cream)"
          >
            {loading
              ? "Création..."
              : isRecurring
                ? "Créer la série"
                : "Créer le rendez-vous"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;

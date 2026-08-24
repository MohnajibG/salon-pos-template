import { useMemo } from "react";
import { Clock, HandCoins, Sparkles } from "lucide-react";

import type { AppointmentService } from "../../types/appointment";

interface AppointmentSummaryProps {
  services: AppointmentService[];

  startTime: string;

  totalDuration: number;

  estimatedPrice: number;

  endTime: string;

  onDurationChange: (value: number) => void;

  onPriceChange: (value: number) => void;

  onEndTimeChange: (value: string) => void;
}

const AppointmentSummary = ({
  services,
  startTime,
  totalDuration,
  estimatedPrice,
  endTime,
  onDurationChange,
  onPriceChange,
  onEndTimeChange,
}: AppointmentSummaryProps) => {
  const calculatedValues = useMemo(() => {
    return services.reduce(
      (total, service) => ({
        price: total.price + service.price,

        duration: total.duration + service.duration,
      }),

      {
        price: 0,
        duration: 0,
      },
    );
  }, [services]);

  const getEmployeeName = (service: AppointmentService) => {
    if (!service.employee) {
      return "Aucun employé";
    }

    if (typeof service.employee === "string") {
      return "Employé sélectionné";
    }

    return `${service.employee.firstName} ${service.employee.lastName}`;
  };

  return (
    <div
      className="
      flex
      flex-col
      gap-5
      rounded-3xl
      border border-(--border)
      bg-white
      p-5
      sm:p-6
      "
    >
      <div
        className="
        flex
        items-center
        justify-between
        "
      >
        <div>
          <div
            className="
            flex
            items-center
            gap-2
            "
          >
            <Sparkles size={18} className="text-(--champagne)" />

            <h3
              className="
              font-semibold
              text-(--black)
              "
            >
              Résumé du rendez-vous
            </h3>
          </div>

          <p
            className="
            mt-2
            text-sm
            text-stone-500
            "
          >
            Début : {startTime}
          </p>
        </div>

        <div
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-2xl
          bg-(--cream)
          "
        >
          <Clock size={18} />
        </div>
      </div>

      <div
        className="
        flex
        flex-col
        gap-3
        "
      >
        {services.length === 0 && (
          <div
            className="
              rounded-2xl
              border border-(--border)
              bg-(--cream)
              p-4
              text-sm
              text-stone-500
              "
          >
            Aucune prestation sélectionnée
          </div>
        )}

        {services.map((service) => (
          <div
            key={service.service}
            className="
              rounded-2xl
              border border-(--border)
              bg-(--cream)
              px-4
              py-3
              "
          >
            <div
              className="
                flex
                justify-between
                "
            >
              <span
                className="
                  font-semibold
                  "
              >
                {service.name}
              </span>

              <span
                className="
                  font-bold
                  "
              >
                {service.price} DA
              </span>
            </div>

            <p
              className="
                mt-1
                text-sm
                text-stone-500
                "
            >
              👤 {getEmployeeName(service)}
            </p>

            <p
              className="
                text-xs
                text-stone-400
                "
            >
              {service.duration} minutes
            </p>
          </div>
        ))}
      </div>

      <div
        className="
        flex
        flex-col
        gap-4
        "
      >
        <div
          className="
          flex
          flex-col
          gap-2
          "
        >
          <label
            className="
            text-sm
            font-medium
            "
          >
            Prix estimé
          </label>

          <div
            className="
            relative
            "
          >
            <HandCoins
              size={17}
              className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-(--champagne)
              "
            />

            <input
              type="number"
              value={estimatedPrice}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="
              h-12
              w-full
              rounded-2xl
              border border-(--border)
              bg-white
              pl-10
              outline-none
              "
            />
          </div>

          <p
            className="
            text-xs
            text-stone-500
            "
          >
            Automatique :{calculatedValues.price} DA
          </p>
        </div>

        <div
          className="
          flex
          flex-col
          gap-2
          "
        >
          <label
            className="
            text-sm
            font-medium
            "
          >
            Durée totale
          </label>

          <input
            type="number"
            value={totalDuration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="
            h-12
            rounded-2xl
            border border-(--border)
            px-4
            outline-none
            "
          />

          <p
            className="
            text-xs
            text-stone-500
            "
          >
            Automatique :{calculatedValues.duration} minutes
          </p>
        </div>

        <div
          className="
          flex
          flex-col
          gap-2
          "
        >
          <label
            className="
            text-sm
            font-medium
            "
          >
            Heure de fin
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="
            h-12
            rounded-2xl
            border border-(--border)
            px-4
            outline-none
            "
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummary;

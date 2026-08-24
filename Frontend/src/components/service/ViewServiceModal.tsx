import { Clock, HandCoins, Layers, Tag, Sparkles, X } from "lucide-react";

import type { Service } from "../../types/service";
import { SPECIALITY_LABELS } from "../../types/speciality";
import { CURRENCY_LABEL } from "../../config/currency";

interface Props {
  service: Service;
  onClose: () => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    <div className="text-(--brown)">{icon}</div>

    <div>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const ViewServiceModal = ({ service, onClose }: Props) => {
  const categoryName =
    typeof service.category === "object" ? service.category?.name : "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
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
            Détail de la prestation
          </h2>
        </div>

        <div className="space-y-5">
          <InfoItem
            icon={<Tag size={20} />}
            label="Nom"
            value={service.name}
          />

          <InfoItem
            icon={<Layers size={20} />}
            label="Catégorie"
            value={categoryName || "-"}
          />

          <InfoItem
            icon={<HandCoins size={20} />}
            label="Prix"
            value={`${service.price} ${CURRENCY_LABEL}`}
          />

          <InfoItem
            icon={<Clock size={20} />}
            label="Durée"
            value={`${service.duration} minutes`}
          />

          <InfoItem
            icon={<Sparkles size={20} />}
            label="Spécialité"
            value={
              service.speciality
                ? SPECIALITY_LABELS[service.speciality]
                : "Non définie"
            }
          />

          {service.description && (
            <div>
              <p className="text-sm text-stone-500">Description</p>
              <p className="mt-1 text-stone-700">{service.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-stone-500">Statut</p>

            <span
              className={`mt-2 inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                service.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {service.isActive ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-2xl bg-(--black) py-3 text-(--cream) transition hover:bg-(--brown-dark)"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ViewServiceModal;

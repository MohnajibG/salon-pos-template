import { motion } from "framer-motion";
import { Clock, HandCoins, Eye, Pencil, Power, Trash2 } from "lucide-react";
import type { Service } from "../../types/service";
import { SPECIALITY_LABELS } from "../../types/speciality";
import Badge from "../ui/Badge";

interface Props {
  services: Service[];
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggle: (service: Service) => void;
}

const Actions = ({
  service,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: Props & { service: Service }) => (
  <div className="flex gap-2">
    <button
      onClick={() => onView(service)}
      className="rounded-lg bg-(--surface) p-2 transition hover:scale-105"
    >
      <Eye size={16} />
    </button>
    <button
      onClick={() => onEdit(service)}
      className="rounded-lg bg-(--black) p-2 text-white transition hover:scale-105"
    >
      <Pencil size={16} />
    </button>
    <button
      onClick={() => onToggle(service)}
      className="rounded-lg bg-amber-50 p-2 text-amber-700 transition hover:scale-105"
    >
      <Power size={16} />
    </button>
    <button
      onClick={() => onDelete(service)}
      className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:scale-105"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

const ServiceTable = ({
  services,
  onView,
  onEdit,
  onDelete,
  onToggle,
}: Props) => (
  <div className="overflow-hidden rounded-3xl border border-(--border) bg-white">
    <div className="hidden md:block">
      <div className="flex border-b border-(--border) bg-(--surface) px-6 py-4 text-sm font-semibold text-(--muted)">
        <span className="min-w-0 flex-1">Nom</span>
        <span className="min-w-0 flex-1">Catégorie</span>
        <span className="min-w-0 flex-1">Prix</span>
        <span className="min-w-0 flex-1">Durée</span>
        <span className="min-w-0 flex-1">Statut</span>
        <span className="min-w-0 flex-1">Spécialité</span>
        <span className="min-w-0 flex-1">Actions</span>
      </div>

      <div className="divide-y divide-(--border)">
        {services.map((service) => (
          <motion.div
            key={service._id}
            whileHover={{ backgroundColor: "var(--surface)" }}
            className="flex items-center px-6 py-5 text-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-(--black)">{service.name}</p>
              {service.description && (
                <p className="text-xs text-(--muted)">{service.description}</p>
              )}
            </div>
            <span className="min-w-0 flex-1">{service.category.name}</span>
            <span className="flex min-w-0 flex-1 items-center gap-1 font-semibold">
              <HandCoins size={14} />
              {service.price}
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-1">
              <Clock size={14} />
              {service.duration} min
            </span>
            <div className="min-w-0 flex-1">
              <Badge variant={service.isActive ? "success" : "danger"}>
                {service.isActive ? "Actif" : "Inactif"}
              </Badge>
            </div>
            <span className="min-w-0 flex-1">
              {service.speciality
                ? SPECIALITY_LABELS[service.speciality]
                : "Non définie"}
            </span>
            <div className="min-w-0 flex-1">
              <Actions
                service={service}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
                services={services}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="space-y-4 p-4 md:hidden">
      {services.map((service) => (
        <motion.div
          key={service._id}
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-(--border) p-5"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-title text-xl font-bold">{service.name}</h3>
              <p className="text-sm text-(--muted)">{service.category.name}</p>
            </div>
            <Badge variant={service.isActive ? "success" : "danger"}>
              {service.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              Prix : <b className="ml-2">{service.price} DA</b>
            </p>
            <p>
              Durée : <b className="ml-2">{service.duration} min</b>
            </p>
          </div>

          <div className="mt-5">
            <Actions
              service={service}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              services={services}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ServiceTable;

import type { CSSProperties, RefObject } from "react";
import { motion, type PanInfo } from "framer-motion";

import type { Appointment, AppointmentStatus } from "../../types/appointment";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 border-amber-300 text-amber-900",
  confirmed: "bg-blue-100 border-blue-300 text-blue-900",
  in_progress: "bg-purple-100 border-purple-300 text-purple-900",
  completed: "bg-emerald-100 border-emerald-300 text-emerald-900",
  waiting_payment: "bg-orange-100 border-orange-300 text-orange-900",
  paid: "bg-green-100 border-green-300 text-green-900",
  cancelled: "bg-red-50 border-red-200 text-red-400 line-through opacity-60",
  no_show: "bg-stone-100 border-stone-300 text-stone-500",
};

interface AppointmentBlockProps {
  appointment: Appointment;
  style: CSSProperties;
  readOnly?: boolean;
  dragConstraintsRef: RefObject<HTMLElement | null>;
  onClick?: () => void;
  onDragEnd?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => void;
}

const clientLabel = (appointment: Appointment) =>
  typeof appointment.client === "string"
    ? ""
    : `${appointment.client.firstName} ${appointment.client.lastName}`;

const AppointmentBlock = ({
  appointment,
  style,
  readOnly = false,
  dragConstraintsRef,
  onClick,
  onDragEnd,
}: AppointmentBlockProps) => {
  const draggable =
    !readOnly &&
    !["cancelled", "completed", "waiting_payment", "paid", "no_show"].includes(
      appointment.status,
    );

  return (
    <motion.div
      style={style}
      drag={draggable}
      dragConstraints={dragConstraintsRef}
      dragElastic={0}
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={{ scale: 1.03, zIndex: 40, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}
      onDragEnd={onDragEnd}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={`overflow-hidden rounded-lg border px-2 py-1 text-left text-xs shadow-sm ${
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      } ${STATUS_COLORS[appointment.status]}`}
    >
      <p className="truncate font-semibold">{clientLabel(appointment)}</p>
      <p className="truncate">
        {appointment.startTime} · {appointment.services.map((s) => s.name).join(", ")}
      </p>
    </motion.div>
  );
};

export default AppointmentBlock;

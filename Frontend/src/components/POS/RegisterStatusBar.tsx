import { useEffect, useState } from "react";
import { CalendarDays, Clock, Lock, Wallet } from "lucide-react";

import type { CashRegister } from "../../types/cashRegister";
import { CURRENCY_LABEL } from "../../config/currency";

type Props = {
  register: CashRegister;
  onRequestClose: () => void;
};

const formatDuration = (start: string) => {
  const diff = Date.now() - new Date(start).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h${minutes.toString().padStart(2, "0")}`;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const RegisterStatusBar = ({ register, onRequestClose }: Props) => {
  const [duration, setDuration] = useState(formatDuration(register.openedAt));

  useEffect(() => {
    const timer = setInterval(
      () => setDuration(formatDuration(register.openedAt)),
      30000,
    );
    return () => clearInterval(timer);
  }, [register.openedAt]);

  const totalToday =
    register.totals.cash + register.totals.card + register.totals.transfer;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-(--border) bg-(--black) p-5 text-(--cream) sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--champagne)/20">
          <Wallet size={22} className="text-(--champagne)" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--champagne)">
            Caisse ouverte
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-(--cream)/70">
            <CalendarDays size={14} />
            <span className="capitalize">{formatDate(register.date)}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-(--cream)/70">
            <Clock size={14} />
            Ouverte à {formatTime(register.openedAt)} • Depuis {duration} •
            Fond {register.openingAmount} {CURRENCY_LABEL}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs text-(--cream)/50">Encaissé aujourd'hui</p>
          <p className="text-xl font-bold text-(--champagne)">
            {totalToday} {CURRENCY_LABEL}
          </p>
        </div>

        <button
          onClick={onRequestClose}
          className="flex items-center gap-2 rounded-xl bg-red-500/20 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/30"
        >
          <Lock size={16} />
          Fermer la caisse
        </button>
      </div>
    </div>
  );
};

export default RegisterStatusBar;

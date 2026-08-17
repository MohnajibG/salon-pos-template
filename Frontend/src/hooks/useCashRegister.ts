/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import {
  getCurrentCashRegister,
  openCashRegister,
  closeCashRegister,
} from "../api/cashRegister.api";

import type { CashRegister } from "../types/cashRegister";

const useCashRegister = () => {
  const [register, setRegister] = useState<CashRegister | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const current = await getCurrentCashRegister();
      setRegister(current);
    } catch (err) {
      console.error("[CashRegister] load:", err);
      setError("Impossible de charger la session de caisse");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = async (openingAmount: number) => {
    try {
      setOpening(true);
      setError("");

      const created = await openCashRegister({ openingAmount });
      setRegister(created);

      return created;
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ??
        "Impossible d'ouvrir la caisse";
      setError(message);
      throw err;
    } finally {
      setOpening(false);
    }
  };

  const close = async (closingAmount: number, notes?: string) => {
    try {
      setClosing(true);
      setError("");

      const closed = await closeCashRegister({ closingAmount, notes });
      setRegister(null);

      return closed;
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ??
        "Impossible de fermer la caisse";
      setError(message);
      throw err;
    } finally {
      setClosing(false);
    }
  };

  return {
    register,
    isOpen: register?.status === "open",
    loading,
    opening,
    closing,
    error,
    setError,
    open,
    close,
    refresh: load,
  };
};

export default useCashRegister;

import { Response } from "express";
import { AuthRequest } from "../types/auth";

import {
  openCashRegister,
  closeCashRegister,
  getCurrentCashRegister,
  getCashRegisterHistory,
  getCashRegisterById,
  adminCloseCashRegister,
  adminOpenCashRegister,
  finalizeCashRegister,
} from "../services/cashRegister.service";

export const openCashRegisterController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const register = await openCashRegister(
      req.user!.id,
      Number(req.body.openingAmount),
    );
    return res.status(201).json({ success: true, register });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const closeCashRegisterController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { closingAmount, notes } = req.body;
    const register = await closeCashRegister(
      req.user!.id,
      Number(closingAmount),
      notes,
    );
    return res.json({ success: true, register });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getCurrentCashRegisterController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const register = await getCurrentCashRegister(req.user!.id);
    return res.json({ success: true, register });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCashRegisterByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const register = await getCashRegisterById(req.params.id as string);
    return res.json({ success: true, register });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const getCashRegisterHistoryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { cashier, from, to, status } = req.query;

    const history = await getCashRegisterHistory({
      cashier: cashier as string | undefined,
      from: from as string | undefined,
      to: to as string | undefined,
      status: status as "open" | "closed" | "finalized" | undefined,
    });

    return res.json({ success: true, history });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const adminOpenCashRegisterController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { cashier, openingAmount } = req.body;

    const register = await adminOpenCashRegister(
      cashier,
      Number(openingAmount),
    );

    return res.status(201).json({ success: true, register });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const adminCloseCashRegisterController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { closingAmount, notes } = req.body;

    const register = await adminCloseCashRegister(
      req.params.id as string,
      req.user!.id,
      Number(closingAmount),
      notes,
    );

    return res.json({ success: true, register });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const finalizeCashRegisterController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { finalAmount, notes } = req.body;

    const register = await finalizeCashRegister(
      req.params.id as string,
      req.user!.id,
      Number(finalAmount),
      notes,
    );

    return res.json({ success: true, register });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

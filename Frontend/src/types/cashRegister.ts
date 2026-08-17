export type CashRegisterStatus = "open" | "closed" | "finalized";

export interface CashRegisterCashier {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface CashRegisterTotals {
  cash: number;
  card: number;
  transfer: number;
  ticketsCount: number;
}

export interface CashRegister {
  _id: string;
  cashier: string | CashRegisterCashier;
  date: string;
  openedAt: string;
  closedAt?: string;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: CashRegisterStatus;
  autoClosed?: boolean;
  closedByAdmin?: string | CashRegisterCashier;
  finalizedAt?: string;
  finalizedBy?: string | CashRegisterCashier;
  finalAmount?: number;
  finalDifference?: number;
  finalNotes?: string;
  totals: CashRegisterTotals;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpenCashRegisterPayload {
  openingAmount: number;
}

export interface CloseCashRegisterPayload {
  closingAmount: number;
  notes?: string;
}

export interface AdminOpenCashRegisterPayload {
  cashier: string;
  openingAmount: number;
}

export interface FinalizeCashRegisterPayload {
  finalAmount: number;
  notes?: string;
}

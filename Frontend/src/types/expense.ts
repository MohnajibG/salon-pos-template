export type ExpenseType = "variable" | "semi-variable";

export interface ExpenseCreator {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  type: ExpenseType;
  date: string;
  createdBy: string | ExpenseCreator;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  description: string;
  amount: number;
  type: ExpenseType;
  date: string;
}

import Expense from "../models/Expense";

interface CreateExpenseData {
  description: string;
  amount: number;
  type: "variable" | "semi-variable";
  date: string;
  createdBy: string;
}

export const createExpense = async (data: CreateExpenseData) => {
  if (!data.description?.trim()) {
    throw new Error("La description est obligatoire");
  }

  if (!data.amount || data.amount <= 0) {
    throw new Error("Le montant doit être supérieur à 0");
  }

  if (!["variable", "semi-variable"].includes(data.type)) {
    throw new Error("Type de charge invalide");
  }

  if (!data.date) {
    throw new Error("La date est obligatoire");
  }

  return Expense.create({
    description: data.description.trim(),
    amount: data.amount,
    type: data.type,
    date: new Date(data.date),
    createdBy: data.createdBy,
  });
};

export const getExpenses = async (filters: {
  from?: string;
  to?: string;
  type?: string;
}) => {
  const query: Record<string, unknown> = {};

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.from || filters.to) {
    const dateFilter: Record<string, Date> = {};

    if (filters.from) dateFilter.$gte = new Date(filters.from);
    if (filters.to) dateFilter.$lte = new Date(filters.to);

    query.date = dateFilter;
  }

  return Expense.find(query)
    .populate("createdBy", "firstName lastName")
    .sort({ date: -1 });
};

export const deleteExpense = async (id: string) => {
  const expense = await Expense.findByIdAndDelete(id);

  if (!expense) {
    throw new Error("Charge introuvable");
  }

  return expense;
};

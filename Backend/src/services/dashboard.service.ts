import mongoose from "mongoose";
import Ticket from "../models/Ticket";
import Client from "../models/Client";
import User from "../models/User";
import Appointment from "../models/Appointment";
import Expense from "../models/Expense";

export type DashboardPeriod = "day" | "week" | "month" | "year" | "custom";

interface DateRange {
  start: Date;
  end: Date;
}

export interface DashboardFilters {
  period?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

const ALLOWED_PERIODS: DashboardPeriod[] = [
  "day",
  "week",
  "month",
  "year",
  "custom",
];

/**
 * Calcule début/fin de période selon le filtre demandé
 */
const getRange = (filters: DashboardFilters): DateRange => {
  const period: DashboardPeriod = ALLOWED_PERIODS.includes(
    filters.period as DashboardPeriod,
  )
    ? (filters.period as DashboardPeriod)
    : "month";

  const reference = filters.date ? new Date(filters.date) : new Date();

  if (period === "custom") {
    if (!filters.startDate || !filters.endDate) {
      throw new Error(
        "startDate et endDate sont obligatoires pour une période personnalisée",
      );
    }

    const start = new Date(filters.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (period === "day") {
    const start = new Date(reference);
    start.setHours(0, 0, 0, 0);

    const end = new Date(reference);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (period === "week") {
    const start = new Date(reference);
    const day = start.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (period === "year") {
    const start = new Date(reference.getFullYear(), 0, 1);
    const end = new Date(reference.getFullYear(), 11, 31, 23, 59, 59, 999);

    return { start, end };
  }

  // month (défaut)
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const end = new Date(
    reference.getFullYear(),
    reference.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  return { start, end };
};

/**
 * Période précédente de même durée, pour comparaison
 */
const getPreviousRange = (range: DateRange): DateRange => {
  const duration = range.end.getTime() - range.start.getTime();

  const end = new Date(range.start.getTime() - 1);
  const start = new Date(end.getTime() - duration);

  return { start, end };
};

const percentChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 1000) / 10;
};

const getSalesInRange = async (range: DateRange) => {
  const result = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$total" },
        tickets: { $sum: 1 },
      },
    },
  ]);

  return {
    revenue: result[0]?.revenue || 0,
    tickets: result[0]?.tickets || 0,
  };
};

/**
 * Dashboard ADMIN
 */
export const getAdminDashboard = async (filters: DashboardFilters = {}) => {
  const range = getRange(filters);
  const previousRange = getPreviousRange(range);

  const [currentSales, previousSales] = await Promise.all([
    getSalesInRange(range),
    getSalesInRange(previousRange),
  ]);

  const totalClients = await Client.countDocuments({
    isDeleted: false,
    isActive: true,
  });

  const totalEmployees = await User.countDocuments({
    role: { $in: ["employee", "cashier"] },
    isActive: true,
  });

  const popularServices = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        sales: { $sum: 1 },
        revenue: { $sum: "$items.finalPrice" },
      },
    },
    { $sort: { sales: -1 } },
    { $limit: 5 },
  ]);

  const topEmployees = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.employee",
        revenue: { $sum: "$items.finalPrice" },
        tickets: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
    {
      $project: {
        _id: 0,
        employeeId: "$employee._id",
        name: { $concat: ["$employee.firstName", " ", "$employee.lastName"] },
        revenue: 1,
        tickets: 1,
      },
    },
  ]);

  const topCashiers = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    {
      $group: {
        _id: "$createdBy",
        revenue: { $sum: "$total" },
        tickets: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
        revenue: 1,
        tickets: 1,
      },
    },
  ]);

  const paymentBreakdown = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        revenue: { $sum: "$total" },
        tickets: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const categoryBreakdown = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "services",
        localField: "items.service",
        foreignField: "_id",
        as: "serviceDoc",
      },
    },
    { $unwind: "$serviceDoc" },
    {
      $lookup: {
        from: "categories",
        localField: "serviceDoc.category",
        foreignField: "_id",
        as: "categoryDoc",
      },
    },
    { $unwind: "$categoryDoc" },
    {
      $group: {
        _id: "$categoryDoc._id",
        name: { $first: "$categoryDoc.name" },
        revenue: { $sum: "$items.finalPrice" },
        sales: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const totalTicketsInRange = await Ticket.countDocuments({
    createdAt: { $gte: range.start, $lte: range.end },
  });

  const cancelledTickets = await Ticket.find({
    status: "cancelled",
    createdAt: { $gte: range.start, $lte: range.end },
  }).select("total");

  const cancelledCount = cancelledTickets.length;
  const cancelledValue = cancelledTickets.reduce((sum, t) => sum + t.total, 0);

  const totalAppointments = await Appointment.countDocuments({
    createdAt: { $gte: range.start, $lte: range.end },
  });

  const completedAppointments = await Appointment.countDocuments({
    status: { $in: ["completed", "paid"] },
    createdAt: { $gte: range.start, $lte: range.end },
  });

  const noShowAppointments = await Appointment.countDocuments({
    status: "no_show",
    createdAt: { $gte: range.start, $lte: range.end },
  });

  const cancelledAppointments = await Appointment.countDocuments({
    status: "cancelled",
    createdAt: { $gte: range.start, $lte: range.end },
  });

  const clientIdsInRange = await Ticket.distinct("client", {
    status: "paid",
    createdAt: { $gte: range.start, $lte: range.end },
  });

  const newClientsCount = await Client.countDocuments({
    createdAt: { $gte: range.start, $lte: range.end },
    isDeleted: false,
  });

  const returningClientsCount = await Client.countDocuments({
    _id: { $in: clientIdsInRange },
    createdAt: { $lt: range.start },
  });

  const diffDays =
    (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24);
  const dateFormat = diffDays > 62 ? "%Y-%m" : "%Y-%m-%d";

  const evolution = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        revenue: { $sum: "$total" },
        tickets: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const expenseBreakdown = await Expense.aggregate([
    {
      $match: {
        date: { $gte: range.start, $lte: range.end },
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const expensesEvolution = await Expense.aggregate([
    {
      $match: {
        date: { $gte: range.start, $lte: range.end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$date" } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalExpenses = expenseBreakdown.reduce((sum, e) => sum + e.total, 0);

  return {
    range: {
      start: range.start,
      end: range.end,
    },

    sales: {
      current: currentSales,
      previous: previousSales,
      change: {
        revenue: percentChange(currentSales.revenue, previousSales.revenue),
        tickets: percentChange(currentSales.tickets, previousSales.tickets),
      },
    },

    averageBasket:
      currentSales.tickets > 0
        ? Math.round((currentSales.revenue / currentSales.tickets) * 100) / 100
        : 0,

    clients: {
      total: totalClients,
      new: newClientsCount,
      returning: returningClientsCount,
    },

    employees: {
      total: totalEmployees,
    },

    popularServices,
    topEmployees,
    topCashiers,
    paymentBreakdown,
    categoryBreakdown,

    cancellation: {
      totalTickets: totalTicketsInRange,
      cancelledCount,
      cancelledValue,
      rate:
        totalTicketsInRange > 0
          ? Math.round((cancelledCount / totalTicketsInRange) * 1000) / 10
          : 0,
    },

    appointments: {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      noShow: noShowAppointments,
      conversionRate:
        totalAppointments > 0
          ? Math.round((completedAppointments / totalAppointments) * 1000) / 10
          : 0,
      noShowRate:
        totalAppointments > 0
          ? Math.round((noShowAppointments / totalAppointments) * 1000) / 10
          : 0,
    },

    evolution,

    expenses: {
      total: totalExpenses,
      breakdown: expenseBreakdown,
      evolution: expensesEvolution,
    },
  };
};

/**
 * Dashboard CASHIER (inchangé)
 */
export const getCashierDashboard = async (cashierId: string) => {
  const today = getRange({ period: "day" });
  const month = getRange({ period: "month" });

  const cashierObjectId = new mongoose.Types.ObjectId(cashierId);

  const salesToday = await getSalesInRangeForCashier(today, cashierObjectId);
  const salesMonth = await getSalesInRangeForCashier(month, cashierObjectId);

  return {
    salesToday,
    salesMonth,
  };
};

const getSalesInRangeForCashier = async (
  range: DateRange,
  cashierId: mongoose.Types.ObjectId,
) => {
  const result = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
        createdBy: cashierId,
        createdAt: { $gte: range.start, $lte: range.end },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$total" },
        tickets: { $sum: 1 },
      },
    },
  ]);

  return {
    revenue: result[0]?.revenue || 0,
    tickets: result[0]?.tickets || 0,
  };
};

/**
 * Dashboard EMPLOYEE (inchangé, fix précédent conservé)
 */
export const getEmployeeDashboard = async (employeeId: string) => {
  const empId = new mongoose.Types.ObjectId(employeeId);

  const performance = await Ticket.aggregate([
    { $match: { status: "paid", "items.employee": empId } },
    { $unwind: "$items" },
    { $match: { "items.employee": empId } },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$items.finalPrice" },
        tickets: { $sum: 1 },
      },
    },
  ]);

  const clientsServed = await Ticket.distinct("client", {
    "items.employee": empId,
    status: "paid",
  });

  const servicesDone = await Ticket.aggregate([
    { $match: { "items.employee": empId, status: "paid" } },
    { $unwind: "$items" },
    { $match: { "items.employee": empId } },
    {
      $group: {
        _id: "$items.name",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return {
    performance: {
      revenue: performance[0]?.revenue || 0,
      tickets: performance[0]?.tickets || 0,
    },
    clientsServed: clientsServed.length,
    servicesDone,
  };
};

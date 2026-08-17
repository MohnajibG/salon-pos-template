import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
} from "../services/employee.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue";
};

/**
 * POST /api/employees
 * Créer employee ou cashier
 * ADMIN uniquement
 */
export const createEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé",
      });
    }

    const result = await createEmployee(req.body, adminId);

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * GET /api/employees
 *
 * Admin :
 * - employee
 * - cashier
 *
 * Cashier :
 * - employee uniquement
 *
 * Query :
 * ?search=Sarah
 */
export const getEmployeesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const role =
      req.query.role === "employee" || req.query.role === "cashier"
        ? req.query.role
        : undefined;

    const isActive =
      req.query.isActive === undefined
        ? undefined
        : req.query.isActive === "true";

    const employees = await getEmployees({ search, role, isActive });

    return res.status(200).json({
      success: true,

      employees,
    });
  } catch (error: unknown) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: getErrorMessage(error),
    });
  }
};

/**
 * GET /api/employees/:id
 */
export const getEmployeeByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await getEmployeeById(req.params.id as string);

    return res.status(200).json({
      success: true,

      employee,
    });
  } catch (error: unknown) {
    return res.status(404).json({
      success: false,

      message: getErrorMessage(error),
    });
  }
};

/**
 * PATCH /api/employees/:id
 * ADMIN uniquement
 */
export const updateEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await updateEmployee(req.params.id as string, req.body);

    return res.status(200).json({
      success: true,

      employee,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,

      message: getErrorMessage(error),
    });
  }
};

/**
 * PATCH /api/employees/:id/status
 */
export const updateEmployeeStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,

        message: "isActive doit être un booléen",
      });
    }

    const employee = await updateEmployeeStatus(
      req.params.id as string,
      isActive,
    );

    return res.status(200).json({
      success: true,

      employee,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,

      message: getErrorMessage(error),
    });
  }
};

/**
 * DELETE /api/employees/:id
 */
export const deleteEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,

        message: "Non autorisé",
      });
    }

    const employee = await deleteEmployee(req.params.id as string, adminId);

    return res.status(200).json({
      success: true,

      message: "Employé supprimé avec succès",

      employee,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,

      message: getErrorMessage(error),
    });
  }
};
export const getMyEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await getMyEmployee(req.user!.id);

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error: any) {
    console.error("GET MY EMPLOYEE ERROR", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

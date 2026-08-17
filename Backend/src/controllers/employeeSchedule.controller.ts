import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  getOrCreateSchedule,
  updateWeeklyHours,
  addException,
  removeException,
} from "../services/employeeSchedule.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue";
};

/**
 * GET /api/employees/:id/schedule
 */
export const getScheduleController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const schedule = await getOrCreateSchedule(req.params.id as string);

    return res.status(200).json({ success: true, schedule });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * PUT /api/employees/:id/schedule
 */
export const updateScheduleController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const schedule = await updateWeeklyHours(
      req.params.id as string,
      req.body.weeklyHours,
    );

    return res.status(200).json({ success: true, schedule });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * POST /api/employees/:id/schedule/exceptions
 */
export const addExceptionController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { date, isOff, start, end, reason } = req.body;

    const schedule = await addException(req.params.id as string, {
      date: new Date(date),
      isOff: Boolean(isOff),
      start,
      end,
      reason,
    });

    return res.status(201).json({ success: true, schedule });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * DELETE /api/employees/:id/schedule/exceptions/:exceptionId
 */
export const removeExceptionController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const schedule = await removeException(
      req.params.id as string,
      req.params.exceptionId as string,
    );

    return res.status(200).json({ success: true, schedule });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

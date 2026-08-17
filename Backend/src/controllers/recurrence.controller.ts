import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  createRecurringAppointment,
  getRecurrenceOccurrences,
  cancelRecurrenceSeries,
} from "../services/recurrence.service";

/**
 * POST /api/appointments/recurring
 */
export const createRecurringAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { client, services, date, startTime, source, notes, recurrence } =
      req.body;

    const result = await createRecurringAppointment({
      client,
      services,
      date: new Date(date),
      startTime,
      source,
      notes,
      createdBy: req.user!.id,
      recurrence: {
        frequency: recurrence.frequency,
        count: recurrence.count,
        until: recurrence.until ? new Date(recurrence.until) : undefined,
      },
    });

    return res.status(201).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/appointments/recurring/:groupId
 */
export const getRecurrenceOccurrencesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointments = await getRecurrenceOccurrences(
      req.params.groupId as string,
    );

    return res.json({ success: true, appointments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/appointments/recurring/:groupId/cancel
 */
export const cancelRecurrenceSeriesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const cancelled = await cancelRecurrenceSeries(
      req.params.groupId as string,
      req.user!.id,
    );

    return res.json({ success: true, cancelled });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  createWaitlistEntry,
  getWaitlist,
  findMatchesForSlot,
  convertWaitlistEntry,
  cancelWaitlistEntry,
} from "../services/waitlist.service";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue";
};

/**
 * POST /api/waitlist
 */
export const createWaitlistEntryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { client, services, desiredDateFrom, desiredDateTo, notes } =
      req.body;

    const entry = await createWaitlistEntry({
      client,
      services,
      desiredDateFrom: new Date(desiredDateFrom),
      desiredDateTo: desiredDateTo ? new Date(desiredDateTo) : undefined,
      notes,
      createdBy: req.user!.id,
    });

    return res.status(201).json({ success: true, entry });
  } catch (error: unknown) {
    return res.status(400).json({ success: false, message: getErrorMessage(error) });
  }
};

/**
 * GET /api/waitlist
 */
export const getWaitlistController = async (req: AuthRequest, res: Response) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;

    const entries = await getWaitlist({ status });

    return res.json({ success: true, entries });
  } catch (error: unknown) {
    return res.status(500).json({ success: false, message: getErrorMessage(error) });
  }
};

/**
 * GET /api/waitlist/matches?date=&employee=&services=id1,id2
 */
export const getWaitlistMatchesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { date, employee, services } = req.query;

    if (!date || !services) {
      return res.status(400).json({
        success: false,
        message: "date et services sont obligatoires",
      });
    }

    const serviceIds = (services as string).split(",").filter(Boolean);

    const matches = await findMatchesForSlot({
      employeeId: employee as string | undefined,
      date: new Date(date as string),
      serviceIds,
    });

    return res.json({ success: true, matches });
  } catch (error: unknown) {
    return res.status(500).json({ success: false, message: getErrorMessage(error) });
  }
};

/**
 * POST /api/waitlist/:id/convert
 */
export const convertWaitlistEntryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { services, date, startTime, source, notes } = req.body;

    const appointment = await convertWaitlistEntry(req.params.id as string, {
      services,
      date: new Date(date),
      startTime,
      source,
      notes,
      createdBy: req.user!.id,
    });

    return res.status(201).json({ success: true, appointment });
  } catch (error: unknown) {
    return res.status(400).json({ success: false, message: getErrorMessage(error) });
  }
};

/**
 * PATCH /api/waitlist/:id/cancel
 */
export const cancelWaitlistEntryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const entry = await cancelWaitlistEntry(req.params.id as string);

    return res.json({ success: true, entry });
  } catch (error: unknown) {
    return res.status(400).json({ success: false, message: getErrorMessage(error) });
  }
};

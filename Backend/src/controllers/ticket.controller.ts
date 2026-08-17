import { Response } from "express";
import { AuthRequest } from "../types/auth";

import {
  createTicket,
  getTickets,
  getTicketById,
  cancelTicket,
  updateTicketAdmin,
  createTicketFromAppointment,
} from "../services/ticket.service";

export const createTicketController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await createTicket({
      ...req.body,
      createdBy: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTicketsController = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await getTickets(req.query);

    return res.json({
      success: true,
      tickets,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTicketByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await getTicketById(req.params.id as string);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket introuvable",
      });
    }

    return res.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelTicketController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await cancelTicket(req.params.id as string, req.user!.id);

    return res.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTicketController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await updateTicketAdmin(
      req.params.id as string,
      req.body,
      req.user!.id,
    );

    return res.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTicketFromAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ticket = await createTicketFromAppointment({
      ...req.body,

      appointment: req.params.id as string,

      createdBy: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export { createTicketFromAppointment };

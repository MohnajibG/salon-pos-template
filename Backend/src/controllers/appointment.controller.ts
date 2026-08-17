import { Response } from "express";

import { AuthRequest } from "../types/auth";
import User from "../models/User";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  rescheduleAppointment,
  deleteAppointment,
  cancelAppointment,
  completeAppointment,
  payAppointment,
  getTodayAppointments,
  AppointmentFilter,
} from "../services/appointment.service";

import { AppointmentStatus } from "../models/Appointment";
import Appointment from "../models/Appointment";

/**
 * Création
 */
export const createAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await createAppointment({
      ...req.body,
      date: new Date(req.body.date),
      createdBy: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Liste
 */
export const getAppointmentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { status, employeeId, clientId, dateFrom, dateTo } = req.query;

    const filter: AppointmentFilter = {
      status: status as AppointmentStatus | undefined,
      employeeId: employeeId as string | undefined,
      clientId: clientId as string | undefined,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
    };

    const appointments = await getAppointments(filter);

    return res.json({
      success: true,
      appointments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Détail
 */
export const getAppointmentByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await getAppointmentById(req.params.id as string);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable",
      });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Modification
 */
export const updateAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { date, startTime, services, status, notes, noShowReason } =
      req.body;

    const appointment = await updateAppointment(req.params.id as string, {
      date: date ? new Date(date) : undefined,
      startTime,
      services,
      status,
      notes,
      noShowReason,
      updatedBy: req.user!.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable",
      });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Déplacement rapide (drag-and-drop calendrier)
 */
export const rescheduleAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { date, startTime } = req.body;

    const appointment = await rescheduleAppointment(
      req.params.id as string,
      { date: new Date(date), startTime },
      req.user!.id,
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable",
      });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Suppression définitive
 */
export const deleteAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    await deleteAppointment(req.params.id as string);

    return res.json({
      success: true,
      message: "Rendez-vous supprimé",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Annulation
 */
export const cancelAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await cancelAppointment(
      req.params.id as string,
      req.user!.id,
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable",
      });
    }

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Fin prestation
 * Passage caisse
 */
export const completeAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const result = await completeAppointment(
      req.params.id as string,
      req.user!.id,
    );

    return res.json({
      success: true,
      appointment: result.appointment,
      ticket: result.ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Liste POS attente paiement
 */
export const getWaitingPaymentAppointmentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointments = await Appointment.find({
      status: "waiting_payment",
    })
      .populate("client", "firstName lastName phone")
      .populate("services.employee", "firstName lastName speciality")
      .sort({
        date: 1,
        startTime: 1,
      });

    return res.json({
      success: true,
      appointments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Paiement POS
 */
export const payAppointmentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointment = await payAppointment(
      req.params.id as string,
      req.user!.id,
    );

    return res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyEmployeeController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const employee = await User.findById(req.user?.id).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employé introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("GET MY EMPLOYEE ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

export const getTodayAppointmentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const appointments = await getTodayAppointments();
    return res.json({ success: true, appointments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

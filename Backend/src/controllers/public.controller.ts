import { Request, Response } from "express";

import {
  getPublicServices,
  getPublicEmployees,
  getAvailability,
  createOnlineAppointment,
} from "../services/public.service";

/**
 * Services disponibles publiquement
 */
export const getPublicServicesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const services = await getPublicServices();

    res.json({
      success: true,

      services,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Employés disponibles publiquement
 */
export const getPublicEmployeesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const employees = await getPublicEmployees();

    res.json({
      success: true,

      employees,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Disponibilité employé
 */
export const getAvailabilityController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { employee, date } = req.query;

    if (!employee || !date) {
      return res.status(400).json({
        success: false,

        message: "employee et date sont obligatoires",
      });
    }

    const availability = await getAvailability(
      employee as string,

      new Date(date as string),
    );

    res.json({
      success: true,

      availability,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/**
 * Créer réservation online
 */
export const createOnlineAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointment = await createOnlineAppointment({
      ...req.body,
      date: new Date(req.body.date),
    });

    res.status(201).json({
      success: true,

      appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  createService,
  getServices,
  getServiceById,
  updateService,
  updateServiceStatus,
  deleteService,
} from "../services/service.service";

/**
 * POST /services
 */
export const createServiceController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const service = await createService(req.body, adminId);

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /services
 */
export const getServicesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { category, isActive, search } = req.query;

    const services = await getServices({
      category: category as string | undefined,

      isActive: isActive !== undefined ? isActive === "true" : undefined,

      search: search as string | undefined,
    });

    return res.status(200).json({
      success: true,
      services,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /services/:id
 */
export const getServiceByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const service = await getServiceById(req.params.id as string);

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /services/:id
 */
export const updateServiceController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const service = await updateService(
      req.params.id as string,
      req.body,
      adminId,
    );

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /services/:id/status
 */
export const updateServiceStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be boolean",
      });
    }

    const service = await updateServiceStatus(
      req.params.id as string,
      isActive,
      adminId,
    );

    return res.status(200).json({
      success: true,
      message: "Service status updated successfully",
      service,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /services/:id
 */
export const deleteServiceController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await deleteService(req.params.id as string, adminId);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

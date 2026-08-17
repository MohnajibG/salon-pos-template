import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  updateClientStatus,
  deleteClient,
} from "../services/client.service";

/**
 * POST /api/clients
 * Créer un client
 */
export const createClientController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const client = await createClient(req.body, req.user!.id);

    return res.status(201).json({
      success: true,
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/clients
 * Liste des clients
 */
export const getClientsController = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getClients({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 20,

      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/clients/:id
 * Détail client
 */
export const getClientByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const client = await getClientById(req.params.id as string);

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /api/clients/:id
 * Modifier un client
 */
export const updateClientController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const client = await updateClient(
      req.params.id as string,
      req.body,
      req.user!.id,
    );

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /api/clients/:id/status
 * Activer / désactiver
 */
export const updateClientStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { isActive } = req.body;

    const client = await updateClientStatus(
      req.params.id as string,
      isActive,
      req.user!.id,
    );

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /api/clients/:id
 * Suppression logique
 */
export const deleteClientController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const client = await deleteClient(req.params.id as string, req.user!.id);

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      client,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

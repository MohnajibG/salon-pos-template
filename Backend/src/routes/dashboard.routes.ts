import { Router } from "express";

import { getDashboardController } from "../controllers/dashboard.controller";

import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * Dashboard utilisateur connecté
 */
router.get(
  "/",

  authenticate,

  getDashboardController,
);

export default router;

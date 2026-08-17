import { Router } from "express";

import {
  getPublicServicesController,
  getPublicEmployeesController,
  getAvailabilityController,
  createOnlineAppointmentController,
} from "../controllers/public.controller";

const router = Router();

/*
==================================
Services publics
==================================
*/

router.get(
  "/services",

  getPublicServicesController,
);

/*
==================================
Employés publics
==================================
*/

router.get(
  "/employees",

  getPublicEmployeesController,
);

/*
==================================
Créneaux disponibles
==================================
*/

router.get(
  "/availability",

  getAvailabilityController,
);

/*
==================================
Réservation online
==================================
*/

router.post(
  "/appointments",

  createOnlineAppointmentController,
);

export default router;

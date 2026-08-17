import { Router } from "express";

import {
  createTicketController,
  getTicketsController,
  getTicketByIdController,
  cancelTicketController,
  updateTicketController,
  createTicketFromAppointment,
} from "../controllers/ticket.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  createTicketController,
);

router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  getTicketsController,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  getTicketByIdController,
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("admin"),
  cancelTicketController,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  updateTicketController,
);

router.post(
  "/appointment/:id/create-ticket",
  authenticate,
  authorize("admin", "cashier"),
  createTicketFromAppointment,
);

export default router;

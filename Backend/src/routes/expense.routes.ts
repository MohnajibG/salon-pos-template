import { Router } from "express";

import {
  createExpenseController,
  getExpensesController,
  deleteExpenseController,
} from "../controllers/expense.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authenticate);
router.use(authorize("admin"));

router.post("/", createExpenseController);
router.get("/", getExpensesController);
router.delete("/:id", deleteExpenseController);

export default router;

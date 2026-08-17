import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  updateCategoryStatusController,
  deleteCategoryController,
} from "../controllers/category.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

/**
 * Toutes les routes Categories
 * nécessitent un admin connecté
 */
router.use(authenticate);
router.use(authorize("admin"));

/**
 * POST /api/categories
 * Créer une catégorie
 */
router.post("/", createCategoryController);

/**
 * GET /api/categories
 * Liste des catégories
 */
router.get("/", getCategoriesController);

/**
 * GET /api/categories/:id
 * Détails d'une catégorie
 */
router.get("/:id", getCategoryByIdController);

/**
 * PATCH /api/categories/:id
 * Modifier une catégorie
 */
router.patch("/:id", updateCategoryController);

/**
 * PATCH /api/categories/:id/status
 * Activer / Désactiver une catégorie
 */
router.patch("/:id/status", updateCategoryStatusController);

/**
 * DELETE /api/categories/:id
 * Suppression logique
 */
router.delete("/:id", deleteCategoryController);

export default router;

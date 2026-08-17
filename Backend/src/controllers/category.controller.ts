import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../services/category.service";

/**
 * POST /categories
 */
export const createCategoryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { name, description = "" } = req.body;

    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const category = await createCategory(name, description, adminId);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /categories
 */
export const getCategoriesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /categories/:id
 */
export const getCategoryByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const category = await getCategoryById(req.params.id as string);

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /categories/:id
 */
export const updateCategoryController = async (
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

    const category = await updateCategory(
      req.params.id as string,
      req.body,
      adminId,
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /categories/:id/status
 */
export const updateCategoryStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { isActive } = req.body;

    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be boolean",
      });
    }

    const category = await updateCategoryStatus(
      req.params.id as string,
      isActive,
      adminId,
    );

    return res.status(200).json({
      success: true,
      message: "Category status updated successfully",
      category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /categories/:id
 */
export const deleteCategoryController = async (
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

    await deleteCategory(req.params.id as string, adminId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

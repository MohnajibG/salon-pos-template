import Category from "../models/Category";

/**
 * Créer une catégorie
 */
export const createCategory = async (
  name: string,
  description: string,
  adminId: string,
) => {
  const normalizedName = name.trim();

  const existingCategory = await Category.findOne({
    name: {
      $regex: new RegExp(`^${normalizedName}$`, "i"),
    },
    isDeleted: false,
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name: normalizedName,
    description,
    createdBy: adminId,
  });

  return category;
};

/**
 * Liste des catégories
 */
export const getCategories = async () => {
  return await Category.find({
    isDeleted: false,
  }).sort({
    name: 1,
  });
};

/**
 * Une catégorie
 */
export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }

  return category;
};

/**
 * Modifier
 */
export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
  },
  adminId: string,
) => {
  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }

  if (data.name) {
    const normalizedName = data.name.trim();

    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      name: {
        $regex: new RegExp(`^${normalizedName}$`, "i"),
      },
      isDeleted: false,
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    category.name = normalizedName;
  }

  if (data.description !== undefined) {
    category.description = data.description;
  }

  category.updatedBy = adminId as any;

  await category.save();

  return category;
};

/**
 * Activer / Désactiver
 */
export const updateCategoryStatus = async (
  id: string,
  isActive: boolean,
  adminId: string,
) => {
  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }

  category.isActive = isActive;
  category.updatedBy = adminId as any;

  await category.save();

  return category;
};

/**
 * Suppression logique
 */
export const deleteCategory = async (id: string, adminId: string) => {
  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }

  category.isDeleted = true;
  category.isActive = false;
  category.deletedAt = new Date();
  category.deletedBy = adminId as any;

  await category.save();

  return category;
};

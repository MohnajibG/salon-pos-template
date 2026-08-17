import Service, { ServiceSpeciality } from "../models/Service";
import Category from "../models/Category";

const SPECIALITIES: ServiceSpeciality[] = [
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
  "Waxing",
  "Skincare",
];

/**
 * Créer un service
 */
export const createService = async (
  data: {
    name: string;
    description?: string;
    category: string;
    speciality: ServiceSpeciality;
    price: number;
    duration: number;
  },
  userId: string,
) => {
  const category = await Category.findById(data.category);

  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }

  if (!data.speciality || !SPECIALITIES.includes(data.speciality)) {
    throw new Error("Invalid speciality");
  }

  if (data.price < 0) {
    throw new Error("Invalid price");
  }

  if (data.duration <= 0) {
    throw new Error("Invalid duration");
  }

  const normalizedName = data.name.trim();

  const existingService = await Service.findOne({
    category: data.category,
    name: {
      $regex: new RegExp(`^${normalizedName}$`, "i"),
    },
    isDeleted: false,
  });

  if (existingService) {
    throw new Error("Service already exists in this category");
  }

  const service = await Service.create({
    name: normalizedName,
    description: data.description?.trim() ?? "",
    category: data.category,
    speciality: data.speciality,
    price: data.price,
    duration: data.duration,
    createdBy: userId,
  });

  return service.populate("category", "name");
};

/**
 * Liste des services
 *
 * Utilisé par :
 * - Admin
 * - Caissier (POS)
 */
export const getServices = async (filters?: {
  category?: string;
  isActive?: boolean;
  search?: string;
}) => {
  const query: Record<string, unknown> = {
    isDeleted: false,
    isActive: true,
  };

  if (filters?.category) {
    query.category = filters.category;
  }

  if (filters?.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  if (filters?.search) {
    query.name = {
      $regex: filters.search,
      $options: "i",
    };
  }

  return Service.find(query).populate("category", "name").select("-__v").sort({
    name: 1,
  });
};

/**
 * Un service par ID
 */
export const getServiceById = async (id: string) => {
  const service = await Service.findOne({
    _id: id,
    isDeleted: false,
  }).populate("category", "name");

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

/**
 * Modifier un service
 */
export const updateService = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    category?: string;
    speciality?: ServiceSpeciality;
    price?: number;
    duration?: number;
  },
  userId: string,
) => {
  const service = await Service.findById(id);

  if (!service || service.isDeleted) {
    throw new Error("Service not found");
  }

  if (data.price !== undefined && data.price < 0) {
    throw new Error("Invalid price");
  }

  if (data.duration !== undefined && data.duration <= 0) {
    throw new Error("Invalid duration");
  }

  if (data.speciality !== undefined) {
    if (!SPECIALITIES.includes(data.speciality)) {
      throw new Error("Invalid speciality");
    }

    service.speciality = data.speciality;
  }

  if (data.category) {
    const category = await Category.findById(data.category);

    if (!category || category.isDeleted) {
      throw new Error("Category not found");
    }

    service.category = category._id;
  }

  if (data.name !== undefined) {
    service.name = data.name.trim();
  }

  if (data.description !== undefined) {
    service.description = data.description.trim();
  }

  if (data.price !== undefined) {
    service.price = data.price;
  }

  if (data.duration !== undefined) {
    service.duration = data.duration;
  }

  service.updatedBy = userId as any;

  await service.save();

  return service.populate("category", "name");
};

/**
 * Activer / Désactiver un service
 */
export const updateServiceStatus = async (
  id: string,
  isActive: boolean,
  userId: string,
) => {
  const service = await Service.findById(id);

  if (!service || service.isDeleted) {
    throw new Error("Service not found");
  }

  service.isActive = isActive;
  service.updatedBy = userId as any;

  await service.save();

  return service.populate("category", "name");
};

/**
 * Suppression logique
 */
export const deleteService = async (id: string, userId: string) => {
  const service = await Service.findById(id);

  if (!service || service.isDeleted) {
    throw new Error("Service not found");
  }

  service.isDeleted = true;
  service.isActive = false;

  service.deletedAt = new Date();
  service.deletedBy = userId as any;

  await service.save();

  return service;
};

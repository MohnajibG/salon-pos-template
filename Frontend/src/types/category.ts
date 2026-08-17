export interface Category {
  _id: string;

  name: string;

  description?: string;

  isActive: boolean;

  isDeleted?: boolean;

  createdBy?: string;

  updatedBy?: string;

  deletedBy?: string;

  deletedAt?: string;

  createdAt?: string;

  updatedAt?: string;
}

/**
 * Création catégorie
 */
export interface CreateCategoryPayload {
  name: string;

  description?: string;
}

/**
 * Modification catégorie
 */
export interface UpdateCategoryPayload {
  name?: string;

  description?: string;
}

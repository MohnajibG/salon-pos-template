export interface ServiceCategory {
  _id: string;
  name: string;
}

export type ServiceSpeciality =
  | "Category1"
  | "Category2"
  | "Category3"
  | "Category4"
  | "Reception";

export interface Service {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  speciality: ServiceSpeciality;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  speciality: ServiceSpeciality;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
  speciality?: ServiceSpeciality;
  isActive?: boolean;
}

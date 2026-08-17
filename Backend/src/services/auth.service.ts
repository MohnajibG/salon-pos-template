import { Types } from "mongoose";

import User from "../models/User";

import { hashPassword } from "../utils/hash";

import type { UserRole, Speciality } from "../models/User";

const EMPLOYEE_ROLES = ["employee", "cashier"] as const;

interface CreateEmployeeData {
  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  role: "employee" | "cashier";

  speciality?: Speciality;
}

interface UpdateEmployeeData {
  firstName?: string;

  lastName?: string;

  phone?: string;

  role?: UserRole;

  speciality?: Speciality;
}

/**
 * Création employé / caissier
 */
export const createEmployee = async (
  adminId: string,
  data: CreateEmployeeData,
) => {
  const email = data.email.toLowerCase();

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const temporaryPassword = "Temp1234!";

  const password = await hashPassword(temporaryPassword);

  const employee = await User.create({
    firstName: data.firstName,

    lastName: data.lastName,

    email,

    phone: data.phone ?? "",

    password,

    role: data.role,

    speciality: data.speciality,

    mustChangePassword: true,

    isActive: true,

    createdBy: new Types.ObjectId(adminId),
  });

  return {
    employee: {
      _id: employee._id,

      firstName: employee.firstName,

      lastName: employee.lastName,

      email: employee.email,

      phone: employee.phone,

      role: employee.role,

      speciality: employee.speciality,

      mustChangePassword: employee.mustChangePassword,
    },

    temporaryPassword,
  };
};

/**
 * Liste employés
 */
export const getEmployees = async () => {
  return User.find({
    role: {
      $in: EMPLOYEE_ROLES,
    },
  })

    .select("-password")

    .populate("createdBy", "firstName lastName email");
};

/**
 * Employé par ID
 */
export const getEmployeeById = async (id: string) => {
  const employee = await User.findOne({
    _id: id,

    role: {
      $in: EMPLOYEE_ROLES,
    },
  })

    .select("-password")

    .populate("createdBy", "firstName lastName");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/**
 * Mise à jour employé
 */
export const updateEmployee = async (id: string, data: UpdateEmployeeData) => {
  const employee = await User.findOneAndUpdate(
    {
      _id: id,

      role: {
        $in: EMPLOYEE_ROLES,
      },
    },

    {
      $set: data,
    },

    {
      new: true,
    },
  )

    .select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/**
 * Activation / désactivation
 */
export const updateEmployeeStatus = async (id: string, isActive: boolean) => {
  const employee = await User.findByIdAndUpdate(
    id,

    {
      isActive,
    },

    {
      new: true,
    },
  )

    .select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/**
 * Suppression logique
 */
export const deleteEmployee = async (id: string) => {
  const employee = await User.findByIdAndUpdate(
    id,

    {
      isActive: false,
    },

    {
      new: true,
    },
  )

    .select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

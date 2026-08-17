import mongoose from "mongoose";

import User, { UserRole, Speciality } from "../models/User";
import { hashPassword } from "../utils/hash";

interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  speciality?: Speciality;
}

interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  speciality?: Speciality;
}

const allowedRoles = ["employee", "cashier"] as const;

const allowedSpecialities = [
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
  "Waxing",
  "Skincare",
] as const;

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateTemporaryPassword = () =>
  Math.random().toString(36).slice(-8) + "!";

const validateEmployeeRole = (role: string) => {
  if (!allowedRoles.includes(role as any)) {
    throw new Error("Invalid employee role");
  }
};

const validateSpeciality = (role: UserRole, speciality?: Speciality) => {
  if (role === "employee" && !speciality) {
    throw new Error("La spécialité est obligatoire pour un employé");
  }

  if (role === "cashier" && speciality) {
    throw new Error("Un caissier ne peut pas avoir de spécialité");
  }

  if (speciality && !allowedSpecialities.includes(speciality as any)) {
    throw new Error("Invalid speciality");
  }
};

export const createEmployee = async (
  data: CreateEmployeeData,
  adminId: string,
) => {
  const email = data.email.trim().toLowerCase();

  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  validateEmployeeRole(data.role);
  validateSpeciality(data.role, data.speciality);

  const exists = await User.findOne({
    email,
    isDeleted: false,
  });

  if (exists) {
    throw new Error("Email already exists");
  }

  const temporaryPassword = generateTemporaryPassword();

  const employee = await User.create({
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email,
    phone: data.phone?.trim() ?? "",
    password: await hashPassword(temporaryPassword),
    role: data.role,
    speciality: data.role === "employee" ? data.speciality : undefined,
    mustChangePassword: true,
    isActive: true,
    createdBy: adminId,
  });

  return {
    employee: {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role,
      speciality: employee.speciality,
      mustChangePassword: employee.mustChangePassword,
    },
    temporaryPassword,
  };
};

export const getEmployees = async (filters?: {
  search?: string;
  role?: "employee" | "cashier";
  isActive?: boolean;
}) => {
  const query: any = {
    role: filters?.role ?? "employee",
    isDeleted: false,
    isActive: filters?.isActive ?? true,
  };

  const search = filters?.search;

  if (search) {
    query.$or = [
      {
        firstName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return User.find(query).select("-password").sort({
    firstName: 1,
  });
};

export const getEmployeeById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid employee id");
  }

  const employee = await User.findOne({
    _id: id,
    role: "employee",
    isDeleted: false,
    isActive: true,
  })
    .select("-password")
    .populate("createdBy", "firstName lastName email");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

export const updateEmployee = async (id: string, data: UpdateEmployeeData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid employee id");
  }

  const employee = await User.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (employee.role === "admin") {
    throw new Error("Cannot update admin");
  }

  const role = data.role ?? employee.role;

  const speciality = data.speciality ?? employee.speciality;

  validateEmployeeRole(role);
  validateSpeciality(role, speciality);

  Object.assign(employee, {
    ...data,
    role,
    speciality: role === "employee" ? speciality : undefined,
  });

  await employee.save();

  return employee;
};

export const updateEmployeeStatus = async (id: string, isActive: boolean) => {
  const employee = await User.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  employee.isActive = isActive;

  await employee.save();

  return employee;
};

export const deleteEmployee = async (id: string, adminId: string) => {
  const employee = await User.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  employee.isDeleted = true;
  employee.isActive = false;
  employee.deletedAt = new Date();
  employee.deletedBy = adminId as any;

  await employee.save();

  return employee;
};

export const getMyEmployee = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid employee id");
  }

  const employee = await User.findOne({
    _id: userId,
    role: "employee",
    isDeleted: false,
    isActive: true,
  }).select("-password");

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

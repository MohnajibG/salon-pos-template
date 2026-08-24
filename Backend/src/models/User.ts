import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "admin" | "cashier" | "employee";

export type Speciality =
  | "Category1"
  | "Category2"
  | "Category3"
  | "Category4"
  | "Reception"
  | "Category5"
  | "Category6";

export interface IUser extends Document {
  firstName: string;
  lastName: string;

  email: string;
  password: string;
  phone: string;

  avatar?: string;

  role: UserRole;
  speciality?: Speciality;

  lastLogin?: Date;

  isActive: boolean;
  mustChangePassword: boolean;

  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    avatar: {
      type: String,
      default: undefined,
    },

    role: {
      type: String,
      enum: ["admin", "cashier", "employee"],
      required: true,
      default: "employee",
    },

    speciality: {
      type: String,
      enum: [
        "Category1",
        "Category2",
        "Category3",
        "Category4",
        "Reception",
        "Category5",
        "Category6",
      ],
      default: undefined,
    },

    lastLogin: {
      type: Date,
      default: undefined,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: undefined,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>("User", userSchema);

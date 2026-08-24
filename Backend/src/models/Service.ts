import { Document, Schema, Types, model } from "mongoose";

export type ServiceSpeciality =
  | "Category1"
  | "Category2"
  | "Category3"
  | "Category4"
  | "Reception"
  | "Category5"
  | "Category6";

export interface IService extends Document {
  name: string;
  description?: string;

  category: Types.ObjectId;

  speciality: ServiceSpeciality;

  price: number;

  duration: number;

  currency: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  deletedBy?: Types.ObjectId;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      default: 60,
      min: 1,
    },

    currency: {
      type: String,
      default: "DZD",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IService>("Service", serviceSchema);

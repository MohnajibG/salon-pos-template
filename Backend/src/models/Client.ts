import { Schema, model, Document, Types } from "mongoose";

export type ClientGender = "female" | "male";

export interface IClient extends Document {
  firstName: string;
  lastName: string;

  phone?: string;
  email?: string;

  gender?: ClientGender;

  birthDate?: Date;

  notes?: string;

  loyaltyPoints: number;

  totalSpent: number;

  visitCount: number;

  noShowCount: number;

  attendedCount: number;

  lastVisit?: Date;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  deletedBy?: Types.ObjectId;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
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

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: ["female", "male"],
      default: undefined,
    },

    birthDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    visitCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    noShowCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    attendedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastVisit: {
      type: Date,
      default: null,
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

/**
 * Téléphone unique uniquement s'il est renseigné
 */
clientSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: {
        $type: "string",
        $ne: "",
      },
    },
  },
);

/**
 * Email unique uniquement s'il est renseigné
 */
clientSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: {
        $type: "string",
        $ne: "",
      },
    },
  },
);

export default model<IClient>("Client", clientSchema);

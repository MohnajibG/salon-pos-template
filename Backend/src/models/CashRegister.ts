import { Schema, model, Document, Types } from "mongoose";

export type CashRegisterStatus = "open" | "closed" | "finalized";

export interface ICashRegister extends Document {
  cashier: Types.ObjectId;
  date: string; // "YYYY-MM-DD" -> garantit 1 session/jour/caissier
  openedAt: Date;
  closedAt?: Date;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: CashRegisterStatus;
  autoClosed?: boolean;
  closedByAdmin?: Types.ObjectId;
  finalizedAt?: Date;
  finalizedBy?: Types.ObjectId;
  finalAmount?: number;
  finalDifference?: number;
  finalNotes?: string;
  totals: {
    cash: number;
    card: number;
    transfer: number;
    ticketsCount: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cashRegisterSchema = new Schema<ICashRegister>(
  {
    cashier: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },

    openedAt: { type: Date, required: true, default: Date.now },
    closedAt: { type: Date },

    openingAmount: { type: Number, required: true, min: 0 },
    closingAmount: { type: Number },
    expectedAmount: { type: Number },
    difference: { type: Number },

    status: {
      type: String,
      enum: ["open", "closed", "finalized"],
      default: "open",
    },
    autoClosed: { type: Boolean, default: false },
    closedByAdmin: { type: Schema.Types.ObjectId, ref: "User" },
    finalizedAt: { type: Date },
    finalizedBy: { type: Schema.Types.ObjectId, ref: "User" },
    finalAmount: { type: Number },
    finalDifference: { type: Number },
    finalNotes: { type: String, default: "", trim: true },

    totals: {
      cash: { type: Number, default: 0 },
      card: { type: Number, default: 0 },
      transfer: { type: Number, default: 0 },
      ticketsCount: { type: Number, default: 0 },
    },

    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

// Une seule session par jour et par caissier
cashRegisterSchema.index({ cashier: 1, date: 1 }, { unique: true });

export default model<ICashRegister>("CashRegister", cashRegisterSchema);

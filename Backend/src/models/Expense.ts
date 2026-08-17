import mongoose, { Document, Schema, Types } from "mongoose";

export type ExpenseType = "variable" | "semi-variable";

export interface IExpense extends Document {
  description: string;
  amount: number;
  type: ExpenseType;
  date: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["variable", "semi-variable"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IExpense>("Expense", expenseSchema);

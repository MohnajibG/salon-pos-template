import { Schema, model, Document, Types } from "mongoose";

export type RecurrenceFrequency = "weekly" | "biweekly" | "monthly";

export interface IAppointmentRecurrence extends Document {
  frequency: RecurrenceFrequency;
  count?: number;
  until?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentRecurrenceSchema = new Schema<IAppointmentRecurrence>(
  {
    frequency: {
      type: String,
      enum: ["weekly", "biweekly", "monthly"],
      required: true,
    },

    count: { type: Number, min: 1 },
    until: { type: Date },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default model<IAppointmentRecurrence>(
  "AppointmentRecurrence",
  appointmentRecurrenceSchema,
);

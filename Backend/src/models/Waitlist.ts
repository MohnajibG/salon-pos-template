import { Schema, model, Document, Types } from "mongoose";

export type WaitlistStatus = "waiting" | "matched" | "cancelled";

export interface IWaitlistService {
  service: Types.ObjectId;
  employee?: Types.ObjectId;
}

export interface IWaitlistEntry extends Document {
  client: Types.ObjectId;
  services: IWaitlistService[];
  desiredDateFrom: Date;
  desiredDateTo?: Date;
  notes?: string;
  status: WaitlistStatus;
  matchedAppointment?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const waitlistSchema = new Schema<IWaitlistEntry>(
  {
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },

    services: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        employee: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],

    desiredDateFrom: { type: Date, required: true },
    desiredDateTo: { type: Date },

    notes: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["waiting", "matched", "cancelled"],
      default: "waiting",
    },

    matchedAppointment: { type: Schema.Types.ObjectId, ref: "Appointment" },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

waitlistSchema.index({ status: 1, desiredDateFrom: 1 });
waitlistSchema.index({ client: 1 });

export default model<IWaitlistEntry>("Waitlist", waitlistSchema);

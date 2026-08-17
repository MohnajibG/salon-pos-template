import { Schema, model, Document, Types } from "mongoose";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "waiting_payment"
  | "paid"
  | "cancelled"
  | "no_show";

export type AppointmentSource = "admin" | "cashier" | "online";

export interface IAppointment extends Document {
  client: Types.ObjectId;

  services: {
    service: Types.ObjectId;

    employee: Types.ObjectId;

    name: string;

    price: number;

    duration: number;
  }[];

  date: Date;

  startTime: string;

  endTime: string;

  totalDuration: number;

  estimatedPrice: number;

  status: AppointmentStatus;

  source: AppointmentSource;

  notes?: string;

  noShowReason?: string;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  cancelledBy?: Types.ObjectId;

  cancelledAt?: Date;

  recurrenceGroupId?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    services: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },

        employee: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        duration: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    totalDuration: {
      type: Number,
      required: true,
      default: 0,
    },

    estimatedPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "waiting_payment",
        "paid",
        "cancelled",
        "no_show",
      ],
      default: "pending",
    },

    source: {
      type: String,
      enum: ["admin", "cashier", "online"],
      default: "admin",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    noShowReason: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledAt: {
      type: Date,
    },

    recurrenceGroupId: {
      type: Schema.Types.ObjectId,
      ref: "AppointmentRecurrence",
    },
  },
  {
    timestamps: true,
  },
);

// Recherche planning par date
appointmentSchema.index({
  date: 1,
});

// Recherche des occurrences d'une série récurrente
appointmentSchema.index({ recurrenceGroupId: 1 }, { sparse: true });

// Recherche planning employé
appointmentSchema.index({
  "services.employee": 1,
  date: 1,
});

// Recherche historique client
appointmentSchema.index({
  client: 1,
  date: -1,
});

export default model<IAppointment>("Appointment", appointmentSchema);

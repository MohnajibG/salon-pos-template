import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },

    items: [
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
        },

        originalPrice: {
          type: Number,
          required: true,
        },

        finalPrice: {
          type: Number,
          required: true,
        },

        duration: {
          type: Number,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: true,
    },

    status: {
      type: String,
      enum: ["waiting_payment", "paid", "cancelled"],
      default: "waiting_payment",
    },

    notes: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cashRegister: {
      type: Schema.Types.ObjectId,
      ref: "CashRegister",
    },
    cancelledAt: Date,

    edits: [
      {
        editedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        editedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        previous: {
          items: Schema.Types.Mixed,
          subtotal: Number,
          discount: Number,
          total: Number,
          paymentMethod: String,
          notes: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Ticket", ticketSchema);

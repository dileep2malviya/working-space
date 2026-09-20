
import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    space: {
      type: Schema.Types.ObjectId,
      ref: "Space",
      required: true,
      index: true,
    },

    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "CANCELLED"
      ],
      default: "PENDING",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

bookingSchema.index({
  space: 1,
  bookingDate: 1,
  startTime: 1,
  endTime: 1,
})

bookingSchema.index({
  user: 1,
  bookingDate: -1,
})

export const Booking = mongoose.model("Booking", bookingSchema);

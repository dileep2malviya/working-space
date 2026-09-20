import { z } from "zod";
import mongoose from "mongoose";
import { validateTimeRange } from "../utils/helpers.js";

const objectIdSchema = z.string().refine(
  mongoose.Types.ObjectId.isValid,
  {
    message: "Invalid ObjectId.",
  }
);

const DateSchema = z
  .string({
    error: "Booking date is required.",
  })
  .date("Invalid booking date.");

const timeSchema = z
  .string({
    error: "Time is required.",
  })
  .regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Time must be in HH:mm format."
  );

const createBookingSchema = z
  .object({
    space: objectIdSchema,

    bookingDate: DateSchema,

    startTime: timeSchema,

    endTime: timeSchema,

    notes: z
      .string()
      .trim()
      .max(500)
      .optional(),
  })
  .superRefine(validateTimeRange);

const updateBookingSchema = z
  .object({
    space: objectIdSchema,
    bookingDate: DateSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    notes: z
      .string()
      .trim()
      .max(500)
      .optional(),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      validateTimeRange(data, ctx);
    }
  });


export {
  createBookingSchema,
  updateBookingSchema,
  objectIdSchema,
  timeSchema,
  DateSchema
}
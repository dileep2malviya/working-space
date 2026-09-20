import { z } from "zod";

const bookingSchema = z
  .object({
    space: z.string().min(1, "Space is required."),
    date: z.string().min(1, "Date is required."),
    start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:mm format."),
    end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be in HH:mm format."),
  })
  .refine((data) => data.end > data.start, {
    path: ["end"],
    message: "End time must be after start time.",
  });

export { bookingSchema };
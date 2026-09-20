import { z } from "zod";

const timeSchema = z
  .string({
    error: "Time is required.",
  })
  .min(1, "Time is required.")
  .transform((value) => value.slice(0, 5))
  .refine(
    (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value),
    "Time must be in HH:mm format."
  );

const createMaintenanceSchema = z
  .object({
    space: z
      .string({
        error: "Space is required.",
      })
      .min(1, "Space is required."),

    maintenanceDate: z
      .string({
        error: "Date is required.",
      })
      .min(1, "Date is required."),

    startTime: timeSchema,

    endTime: timeSchema,

    note: z
      .string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  });

export { createMaintenanceSchema };

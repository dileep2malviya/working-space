import { z } from "zod";
import { DateSchema, objectIdSchema, timeSchema } from "./booking.validation.js";
import { validateTimeRange } from "../utils/helpers.js";

const createMaintenanceSchema = z
  .object({
    space: objectIdSchema,

    maintenanceDate: DateSchema,

    startTime: timeSchema,

    endTime: timeSchema,

    note: z.string().trim().max(500).optional(),
  })
  .superRefine(validateTimeRange);

export { createMaintenanceSchema };
import { z } from "zod";

const createSpaceSchema = z.object({
    name: z
      .string({
        error: "Work space name is required."
      })
      .trim()
      .min(3, "Name must be at least 3 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    type: z.enum(["Desk", "Meeting Room"], {
      error: "Work space type is required.",
    }),

    capacity: z.preprocess(
      (value) => (value === "" || value === undefined ? undefined : value),
      z.coerce
        .number({
          error: "Capacity is required.",
        })
        .int("Capacity must be an integer.")
        .positive("Capacity must be greater than 0.")
    ),

    amenities: z
      .array(z.string().trim())
      .default([]),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .default(""),
})

const updateSpaceSchema = z.object({
  name: z
      .string({
        error: "Work space name is required."
      })
      .trim()
      .min(3, "Name must be at least 3 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    type: z.enum(["Desk", "Meeting Room"], {
      error: "Work space type is required.",
    }),

    capacity: z.preprocess(
      (value) => (value === "" || value === undefined ? undefined : value),
      z.coerce
        .number({
          error: "Capacity is required.",
        })
        .int("Capacity must be an integer.")
        .positive("Capacity must be greater than 0.")
    ),

    amenities: z
      .array(z.string().trim())
      .default([]),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .default(""),

    isActive: z.preprocess(
      (value) => {
        if (typeof value === "string") {
          return value.toLowerCase() === "true";
        }
        return value;
      },
      z.boolean().optional()
    ),
  

});

export {
  createSpaceSchema,
  updateSpaceSchema
}
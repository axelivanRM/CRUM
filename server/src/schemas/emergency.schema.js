import * as z from "zod";

// Define the required request fields and their accepted value ranges.
export const emergencySchema = z.object({
  operatorId: z.number().int().positive(),
  contactPhone: z.string().min(1).max(20),
  emergencyType: z.enum(["HIGH", "MEDIUM", "LOW"]),
  description: z.string().nullable().optional(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  ambulanceRequests: z.array(
    z.object({
      ambulanceType: z.enum([
        "TRANSPORT",
        "BASIC",
        "ADVANCED",
        "INTENSIVE_CARE",
      ]),
      quantity: z.number().int().positive(),
    }),
  ),
  ignoreDuplicates: z.boolean().optional(),
});

import * as z from "zod";

// Define the required request fields and their accepted value ranges.
export const emergencySchema = z.object({
  operator_id: z.number().int().positive(),
  contact_phone: z.string().min(1).max(20),
  emergency_type: z.number().int().min(1).max(3),
  description: z.string().nullable().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

import * as z from "zod";
import { userSchema } from "./user.schema.js";

export const operatorSchema = userSchema.extend({
  fullName: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(1, { error: "El nombre es obligatorio" })
    .max(120, { error: "El nombre no puede superar los 120 caracteres" }),

  headquarters: z
    .string({ error: "La sede es obligatoria" })
    .trim()
    .min(1, { error: "La sede es obligatoria" })
    .max(100, { error: "La sede no puede superar los 100 caracteres" }),
});

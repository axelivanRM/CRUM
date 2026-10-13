import * as z from "zod";
import { userSchema } from "./user.schema.js";

export const ambulanceSchema = userSchema.extend({
  licensePlates: z
    .string({ error: "Las placas son obligatorias" })
    .trim()
    .min(1, { error: "Las placas son obligatorias" })
    .max(10, { error: "Las placas no pueden superar los 10 caracteres" }),

  type: z
    .number({ error: "El tipo de ambulancia debe ser un número del 1 al 4" })
    .int({ error: "El tipo de ambulancia debe ser un número entero" })
    .min(1, { error: "El tipo de ambulancia debe ser del 1 al 4" })
    .max(4, { error: "El tipo de ambulancia debe ser del 1 al 4" }),

  operationalBase: z
    .string({ error: "La base operativa es obligatoria" })
    .trim()
    .min(1, { error: "La base operativa es obligatoria" })
    .max(100, {
      error: "La base operativa no puede superar los 100 caracteres",
    }),
});

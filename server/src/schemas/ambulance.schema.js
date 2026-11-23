import * as z from "zod";
import { userSchema } from "./user.schema.js";

export const ambulanceSchema = userSchema.extend({
  licensePlates: z
    .string({ error: "Las placas son obligatorias" })
    .trim()
    .min(1, { error: "Las placas son obligatorias" })
    .max(10, { error: "Las placas no pueden superar los 10 caracteres" }),
  ambulanceType: z.enum(
    ["TRANSPORT", "BASIC", "ADVANCED", "INTENSIVE_CARE"],
    { error: "El tipo de ambulancia debe ser válido" },
  ),
  operationalBase: z
    .string({ error: "La base operativa es obligatoria" })
    .trim()
    .min(1, { error: "La base operativa es obligatoria" })
    .max(100, {
      error: "La base operativa no puede superar los 100 caracteres",
    }),
});

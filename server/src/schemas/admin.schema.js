import * as z from "zod";
import { userSchema } from "./user.schema.js";

export const adminSchema = userSchema.extend({
  accessPassword: z
    .string({ error: "La contraseña de acceso es obligatoria" })
    .min(1, { error: "La contraseña de acceso es obligatoria" }),
});
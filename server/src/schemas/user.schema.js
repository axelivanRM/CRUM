import * as z from "zod";

export const userSchema = z.object({
  user: z.email({
    error: "El formato del correo electrónico no es válido",
  }),

  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(8, {
      error: "La contraseña debe tener al menos 8 caracteres",
    })
    .max(20, {
      error: "La contraseña no puede tener más de 20 caracteres",
    })
    .regex(/[A-Z]/, {
      error: "La contraseña debe contener al menos una mayúscula",
    })
    .regex(/[a-z]/, {
      error: "La contraseña debe contener al menos una minúscula",
    })
    .regex(/[0-9]/, {
      error: "La contraseña debe contener al menos un número",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "La contraseña debe contener al menos un símbolo",
    }),

  rol: z
    .number({ error: "El rol debe ser un número del 1 al 3" })
    .int({ error: "El rol debe ser un número entero" })
    .min(1, { error: "El rol debe ser 1, 2 o 3" })
    .max(3, { error: "El rol debe ser 1, 2 o 3" }),
});

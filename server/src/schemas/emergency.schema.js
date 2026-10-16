import * as z from "zod";

export const emergencySchema = z.object({
  coordinates: z.object({
    lat: z.number({
      required_error: "La latitud es obligatoria",
      invalid_type_error: "La latitud debe ser un número",
    }),
    long: z.number({
      required_error: "La longitud es obligatoria",
      invalid_type_error: "La longitud debe ser un número",
    }),
  }),
  description: z
    .string({
      required_error: "La descripción es obligatoria",
      invalid_type_error: "La descripción debe ser una cadena de texto",
    })
    .max(254, { error: "La descripción debe tener 254 caracteres o menos" }),
  type: z
    .number({
      required_error: "El tipo de emergencia es obligatorio",
      invalid_type_error: "El tipo de emergencia debe ser un número",
    })
    .int({ error: "El tipo de emergencia debe ser un número entero" })
    .min(1, { error: "El tipo de emergencia debe ser como mínimo 1" })
    .max(3, { error: "El tipo de emergencia debe ser como máximo 3" }),
  ambulances: z.object({
    traslade: z
      .number({
        required_error: "La cantidad de ambulancias de traslado es obligatoria",
        invalid_type_error:
          "La cantidad de ambulancias de traslado debe ser un número",
      })
      .int({
        error:
          "La cantidad de ambulancias de traslado debe ser un número entero",
      })
      .min(0, {
        error: "La cantidad de ambulancias de traslado no puede ser negativa",
      }),
    basic: z
      .number({
        required_error: "La cantidad de ambulancias básicas es obligatoria",
        invalid_type_error:
          "La cantidad de ambulancias básicas debe ser un número",
      })
      .int({
        error: "La cantidad de ambulancias básicas debe ser un número entero",
      })
      .min(0, {
        error: "La cantidad de ambulancias básicas no puede ser negativa",
      }),
    advanced: z
      .number({
        required_error: "La cantidad de ambulancias avanzadas es obligatoria",
        invalid_type_error:
          "La cantidad de ambulancias avanzadas debe ser un número",
      })
      .int({
        error: "La cantidad de ambulancias avanzadas debe ser un número entero",
      })
      .min(0, {
        error: "La cantidad de ambulancias avanzadas no puede ser negativa",
      }),
    intensive: z
      .number({
        required_error:
          "La cantidad de ambulancias de cuidados intensivos es obligatoria",
        invalid_type_error:
          "La cantidad de ambulancias de cuidados intensivos debe ser un número",
      })
      .int({
        error:
          "La cantidad de ambulancias de cuidados intensivos debe ser un número entero",
      })
      .min(0, {
        error:
          "La cantidad de ambulancias de cuidados intensivos no puede ser negativa",
      }),
  }),
});

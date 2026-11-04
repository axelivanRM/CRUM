import * as z from "zod";

export const dataLocationSchema = z.object({

        lat: z.number({required_error: "La latitud es obligatoria"})
              .min(-90, "Latitud fuera de rango (-90 a 90)")
              .max(90, "Latitud fuera de rango (-90 a 90)"),

        lng: z.number({required_error: "La longitud es obligatoria"})
              .min(-180, "Longitud fuera de rango (-180 a 180)")
              .max(180, "Longitud fuera de rango (-180 a 180)"),

        h3Index: z.string({required_error: "El h3 es obligatorio"})
                  .length(15, "El h3 debe tener 15 caracteres")
});


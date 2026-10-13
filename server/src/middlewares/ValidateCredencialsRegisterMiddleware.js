import { query } from "../config/database.js";
import * as z from "zod";

const propertiesUser = z.object({
  user: z
    .string({ required_error: "El correo es obligatorio" })
    .trim()
    .toLowerCase()
    .email({ message: "El formato del correo electrónico no es válido" }),

  userPassword: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(20, { message: "La contraseña no puede tener más de 20 caracteres" }),

  rol: z
    .enum(["CRUM", "Ambulancia", "Administrador"], {
      errorMap: () => ({
        message: "El rol debe ser CRUM, Ambulancia o Administrador",
      }),
    })
    .transform((value) => {
      const rolMap = {
        CRUM: 1,
        Ambulancia: 2,
        Administrador: 3,
      };
      return rolMap[value];
    }),
});

const propertiesAdmin = z.object({
  accessPassword: z
    .string({ required_error: "La clave de autorización es obligatoria" })
    .min(1, { message: "La clave de autorización no puede estar vacía" }),
});

const propertiesCrum = z.object({
  userName: z
    .string({ required_error: "El nombre es obligatorio" })
    .max(120, { message: "El nombre no puede tener más de 120 caracteres" })
    .trim(),

  headquartersCrum: z
    .string({ required_error: "La sede es obligatoria" })
    .max(100, { message: "La sede no puede tener más de 100 caracteres" })
    .trim(),
});

const propertiesAmbulance = z.object({
  licensePlates: z
    .string({ required_error: "Las placas son obligatorias" })
    .trim()
    .max(10, { message: "Las placas no pueden tener más de 10 caracteres" }),

  typeOfAmbulance: z
    .enum(
      [
        "Traslado",
        "Urgencias basicas",
        "Urgencias avanzadas",
        "Cuidados intensivos",
      ],
      {
        errorMap: () => ({
          message:
            "El tipo debe ser Traslado, Urgencias basicas, Urgencias avanzadas o Cuidados intensivos",
        }),
      },
    )
    .transform((value) => {
      const typeMap = {
        Traslado: 1,
        "Urgencias basicas": 2,
        "Urgencias avanzadas": 3,
        "Cuidados intensivos": 4,
      };
      return typeMap[value];
    }),

  operationalBase: z
    .string({ required_error: "La base operativa es obligatoria" })
    .trim()
    .max(100, {
      message: "La base operativa no puede tener más de 100 caracteres",
    }),
});

const featuresAdmin = propertiesUser.merge(propertiesAdmin);

const featuresCrum = propertiesUser.merge(propertiesCrum);

const featuresAmbulance = propertiesUser.merge(propertiesAmbulance);

async function validateFeaturesAdmin(req, res, next) {
  const result = featuresAdmin.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      errors: issues,
    });
  }

  try {
    const textQuery = `SELECT 1 FROM usuarios WHERE rol = 3 limit 1`;
    const resultQuery = await query(textQuery);

    if (resultQuery.rows.length > 0) {
      return res.status(403).json({
        status: "error",
        message: "ya existe un administrador registrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al consultar la base de datos",
    });
  }

  req.body = result.data;

  next();
}

function validateFeaturesCrum(req, res, next) {
  const result = featuresCrum.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "datos invalidos",
      errors: issues,
    });
  }

  req.body = result.data;

  next();
}

function validateFeaturesAmbulance(req, res, next) {
  const result = featuresAmbulance.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "datos invalidos",
      errors: issues,
    });
  }

  req.body = result.data;

  next();
}

export {
  validateFeaturesAdmin,
  validateFeaturesCrum,
  validateFeaturesAmbulance,
};

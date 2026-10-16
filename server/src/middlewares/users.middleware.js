import { adminSchema } from "../schemas/admin.schema.js";
import { operatorSchema } from "../schemas/operator.schema.js";
import { ambulanceSchema } from "../schemas/ambulance.schema.js";

import service from "../services/users.service.js";

const ROLE_MAP = {
  ambulance: 1,
  operator: 2,
  admin: 3,
};

async function validateRegistration(req, res, next) {
  let schema;

  // Identify role
  switch (req.params.role) {
    case "admin":
      schema = adminSchema;
      break;
    case "operator":
      schema = operatorSchema;
      break;
    case "ambulance":
      schema = ambulanceSchema;
      break;
    default:
      return res.status(404);
  }

  // Verify schema
  const result = schema.safeParse(req.body);

  // If the payload does not match the role-specific schema,
  // return the validation details so the client can correct the request.
  if (!result.success) {
    return res.status(400).json({
      message: "Error de validación",
      errors: result.error.issues.map(({ path, message }) => ({
        field: path.join("."),
        message,
      })),
    });
  }

  const roleId = ROLE_MAP[req.params.role];

  // Ensure the username is unique in the users table before continuing.
  if (await service.userExists(req.body.username)) {
    return res.status(409).json({
      message: "El usuario ya existe",
    });
  }

  // If the role is admin, validate the access password before proceeding.
  if (req.params.role === "admin") {
    if (req.body.accessPassword !== process.env.ADMIN_ACCESS_PASSWORD) {
      return res.status(403).json({
        message: "Contraseña de acceso incorrecta",
      });
    }
  }

  req.body = result.data;
  next();
}

const middleware = { validateRegistration };

export default middleware;

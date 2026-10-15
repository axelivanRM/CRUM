import { adminSchema } from "../schemas/admin.schema.js";
import { operatorSchema } from "../schemas/operator.schema.js";
import { ambulanceSchema } from "../schemas/ambulance.schema.js";

import service from "../services/users.service.js";

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

  // Ensure the username is unique for the selected role before continuing.
  if (await service.userExists(req.body.username, req.params.role)) {
    return res.status(409).json({
      message: "El usuario ya existe",
    });
  }

  req.body = result.data;
  next();
};

const middleware = { validateRegistration };

export default middleware;
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
      success: false,
      message: "Invalid user data.",
      error: {
        code: "Error in middleware users",
        details: result.error.issues.map(({ path, message }) => ({
          field: path.join("."),
          message,
        })),
      },
    });
  }

  // Ensure the username is unique in the users table before continuing.
  if (await service.userExists(req.body.username)) {
    return res.status(409).json({
      success: false,
      message: "The user already exists in data base",
      error: {
        code: "Error in middleware users",
        details: [{
          field: result.data
        }]
      }
    });
  }

  // If the role is admin, validate the access password before proceeding.
  if (req.params.role === "admin") {
    if (req.body.accessPassword !== process.env.ADMIN_ACCESS_PASSWORD) {
      return res.status(403).json({
        success: false,
        message: "Incorrect access password",
        error: {
          code: "Error in middleware users",
          details: [
            {
              field: req.body.accessPassword,
              message: "Incorrect access password",
            },
          ],
        },
      });
    }
  }

  req.body = result.data;
  next();
}

const middleware = { validateRegistration };

export default middleware;

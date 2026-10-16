import { userSchema } from "../schemas/user.schema.js";

async function validateCredentials(req, res, next) {
  // Verify schema
  const result = userSchema.safeParse(req.body);

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

  req.body = {
    user: result.data.user,
    password: result.data.password,
  };

  next();
}

const middleware = { validateCredentials };

export default middleware;

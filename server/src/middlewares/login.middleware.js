import { userSchema } from "../schemas/user.schema.js";

async function validateCredentials(req, res, next) {
  // Verify schema
  const validation = userSchema.safeParse(req.body);

  // If the payload does not match the role-specific schema,
  // return the validation details so the client can correct the request.
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid user credentials.",
      error: validation.error.issues,
    });
  }

  next();
}

const middleware = { validateCredentials };

export default middleware;

import { emergencySchema } from "../schemas/emergency.schema.js";

// Validate the request payload and confirm its operator exists before creation.
async function validateEmergency(req, res, next) {
  const validation = emergencySchema.safeParse(req.body);

  // Return the schema issues without querying the database for invalid input.
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Datos de emergencia inválidos",
      error: validation.error.issues,
    });
  }

  // Continue to the controller only after both validations pass.
  return next();
}

const middleware = { validateEmergency };

export default middleware;

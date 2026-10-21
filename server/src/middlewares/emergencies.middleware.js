import { emergencySchema } from "../schemas/emergency.schema.js";
import service from "../services/emergencies.service.js";

// Validate the request payload and confirm its operator exists before creation.
async function validateEmergency(req, res, next) {
  const validation = emergencySchema.safeParse(req.body);

  // Return the schema issues without querying the database for invalid input.
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }

  // Reject emergency requests that reference a non-existent operator.
  const isValidOperator = await service.operatorExists(
    validation.data.operator_id,
  );

  if (!isValidOperator) {
    return res.status(400).json({
      error: "operator_id does not belong to an existing operator",
    });
  }

  // Continue to the controller only after both validations pass.
  return next();
}

const middleware = { validateEmergency };

export default middleware;

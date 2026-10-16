import { emergencySchema } from "../schemas/emergency.schema.js";

function validateEmergency(req, res, next) {
  try {
    emergencySchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
}

const middleware = { validateEmergency };

export default middleware;

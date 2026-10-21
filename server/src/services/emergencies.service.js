import { query } from "../config/database.js";

// Check whether the supplied ID belongs to a registered operator.
async function operatorExists(operatorId) {
  const result = await query(
    "SELECT EXISTS (SELECT 1 FROM operators WHERE operator_id = $1) AS exists",
    [operatorId],
  );

  return result.rows[0].exists;
}

// Insert an emergency using parameterized SQL and return its generated ID.
async function createEmergency({
  operator_id,
  contact_phone,
  emergency_type,
  description,
  latitude,
  longitude,
}) {
  const result = await query(
    `INSERT INTO emergencies
        (operator_id, contact_phone, emergency_type, description, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING emergency_id`,
    [
      operator_id,
      contact_phone,
      emergency_type,
      description ?? null,
      latitude,
      longitude,
    ],
  );

  return result.rows[0]?.emergency_id ?? null;
}

const service = {
  operatorExists,
  createEmergency,
};

export default service;

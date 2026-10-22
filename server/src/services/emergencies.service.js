import { query } from "../config/database.config.js";
import { calculateDistance } from "./geo.service.js";
import params from "../config/params.config.js";

// Check whether the supplied ID belongs to a registered operator.
async function operatorExists(operatorId) {
  const result = await query(
    "SELECT EXISTS (SELECT 1 FROM operators WHERE operator_id = $1) AS exists",
    [operatorId],
  );

  return result.rows[0].exists;
}

// Retrieve every emergency that has not been closed, newest first.
async function getActiveEmergencies() {
  const result = await query(
    `SELECT *
       FROM emergencies
       WHERE closed_at IS NULL
       ORDER BY started_at DESC`,
  );

  return result.rows;
}

async function findDuplicateEmergency(emergency) {
  const { latitude, longitude } = emergency;
  const activeEmergencies = await getActiveEmergencies();
  let duplicatedEmergencies = [];

  for (const activeEmergency of activeEmergencies) {
    const distance = calculateDistance(
      latitude,
      longitude,
      activeEmergency.latitude,
      activeEmergency.longitude,
    );
    if (distance <= params.emergencyDuplicateRadius) {
      duplicatedEmergencies.push(activeEmergency);
    }
  }

  return duplicatedEmergencies.length > 0 ? duplicatedEmergencies : null;
}

// Insert an emergency using parameterized SQL and return its generated ID.
async function createEmergency({
  operatorId,
  contactPhone,
  emergencyType,
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
      operatorId,
      contactPhone,
      emergencyType,
      description ?? null,
      latitude,
      longitude,
    ],
  );

  return result.rows[0]?.emergency_id ?? null;
}

const service = {
  operatorExists,
  getActiveEmergencies,
  createEmergency,
  findDuplicateEmergency,
};

export default service;

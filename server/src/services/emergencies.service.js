import { query } from "../config/database.config.js";
import { calculateLinearDistance } from "../utils/geo-functions.js";
import params from "../config/params.config.js";

// Retrieve every emergency that has not been closed, newest first.
async function getActiveEmergencies() {
  const result = await query(
    `SELECT *
       FROM emergencies
       WHERE status = 'ACTIVE'
       ORDER BY started_at DESC`,
  );

  return result.rows;
}

// Check for emergencies that are within a certain distance of the new emergency.
async function findDuplicateEmergency(emergency) {
  const { latitude, longitude } = emergency.location;
  const activeEmergencies = await getActiveEmergencies();
  let duplicatedEmergencies = [];

  for (const activeEmergency of activeEmergencies) {
    const distance = calculateLinearDistance(
      { latitude, longitude },
      {
        latitude: activeEmergency.latitude,
        longitude: activeEmergency.longitude,
      },
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
  location,
}) {
  const result = await query(
    `INSERT INTO emergencies
        (operator_id, contact_phone, emergency_type, description, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
    [
      operatorId,
      contactPhone,
      emergencyType,
      description ?? null,
      location.latitude,
      location.longitude,
    ],
  );

  return result.rows[0];
}

async function createAssignment({ emergencyId, requestedAmbulanceType }) {
  const result = await query(
    `INSERT INTO assignments
        (emergency_id, requested_ambulance_type)
       VALUES ($1, $2)
       RETURNING *`,
    [emergencyId, requestedAmbulanceType],
  );
  return result.rows[0];
}

async function newEmergency(emergencyData) {
  const emergency = await createEmergency(emergencyData);
  let assignments = [];

  for (const ambulanceRequest of emergencyData.ambulanceRequests) {
    const assignment = await createAssignment({
      emergencyId: emergency.emergency_id,
      requestedAmbulanceType: ambulanceRequest.ambulanceType,
    });

    assignments.push(assignment);
  }

  // EJECUTAR INTERMEDIARIO

  return {
    emergency: {
      id: emergency.emergency_id,
      operatorId: emergency.operator_id,
      contactPhone: emergency.contact_phone,
      emergencyType: emergency.emergency_type,
      description: emergency.description,
      location: {
        latitude: emergency.latitude,
        longitude: emergency.longitude,
      },
      status: emergency.status,
    },
    assignments: assignments.map((assignment) => ({
      id: assignment.assignment_id,
      emergencyId: assignment.emergency_id,
      ambulanceId: assignment.ambulance_id,
      requestedAmbulanceType: assignment.requested_ambulance_type,
      status: assignment.status,
    })),
  };
}

const service = {
  getActiveEmergencies,
  findDuplicateEmergency,
  newEmergency,
};

export default service;

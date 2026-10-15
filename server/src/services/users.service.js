import { query } from "../config/database.js";

async function userExists(username) {
  const result = await query(
    "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1);",
    [username],
  );

  return result.rows[0].exists;
}

async function registerAmbulance({
  username,
  password,
  licensePlates,
  ambulanceType,
  operationalBase,
}) {
  let result;

  // Create the user account and retrieve its generated ID.
  result = await query(
    `INSERT INTO users (username, password, role)
    VALUES ($1, $2, 1)
    RETURNING user_id`,
    [username, password],
  );

  // Stop if the user account was not created.
  if (!result.rows[0]) return null;

  const userId = result.rows[0].user_id;

  // Create an ambulance record linked to the newly created user.
  result = await query(
    `INSERT INTO ambulances (ambulance_id, license_plate, ambulance_type, operating_base)
    VALUES ($1, $2, $3, $4)
    RETURNING ambulance_id`,
    [userId, licensePlates, ambulanceType, operationalBase],
  );

  return result.rows[0]?.ambulance_id ?? null;
}

async function registerOperator({
  username,
  password,
  fullName,
  headquarters,
}) {
  let result;

  // Create the user account and retrieve its generated ID.
  result = await query(
    `INSERT INTO users (username, password, role)
    VALUES ($1, $2, 2)
    RETURNING user_id`,
    [username, password],
  );

  // Stop if the user account was not created.
  if (!result.rows[0]) return null;

  const userId = result.rows[0].user_id;

  // Create an operator record linked to the newly created user.
  result = await query(
    `INSERT INTO operators (operator_id, full_name, headquarters)
    VALUES ($1, $2, $3)
    RETURNING operator_id`,
    [userId, fullName, headquarters],
  );

  return result.rows[0]?.operator_id ?? null;
}

async function registerAdmin({ username, password, accessPassword }) {
  // Create the user account and retrieve its generated ID.
  const result = await query(
    `INSERT INTO users (username, password, role)
    VALUES ($1, $2, 3)
    RETURNING user_id`,
    [username, password],
  );

  return result.rows[0]?.user_id ?? null;
}

const service = {
  userExists,
  registerOperator,
  registerAmbulance,
  registerAdmin,
};

export default service;

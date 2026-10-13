import { query } from "../config/database.js";

async function userExists(username, role) {
  const result = await query(
    "SELECT 1 FROM usuarios WHERE username = $1 AND rol = $2",
    [username, role],
  );
  return result.rows.length > 0;
}

async function registerUserAdmin({ user, password, role, accessPassword }) {
  // Crear procedimiento almacenado
}

async function registerUserOperator({
  user,
  password,
  role,
  name,
  headquarters,
}) {
  // Crear procedimiento almacenado
}

async function registerUserAmbulance({
  user,
  password,
  role,
  licensePlates,
  type,
  operationalBase,
}) {
  // Crear procedimiento almacenado
}

export {
  userExists,
  registerUserAdmin,
  registerUserOperator,
  registerUserAmbulance,
};

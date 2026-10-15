import { query } from "../config/database.js";

async function userExists(username, role) {
  const result = await query("SELECT user_exists($1, $2)", [username, role]);
  return result.rows[0].user_exists;
}

async function registerOperator({ user, password, name, headquarters }) {
  const result = await query("SELECT register_operator($1, $2, $3, $4)", [
    user,
    password,
    name,
    headquarters,
  ]);
  return result.rows[0].new_user_id;
}

async function registerAmbulance({
  user,
  password,
  licensePlates,
  type,
  operationalBase,
}) {
  const result = await query("SELECT register_ambulance($1, $2, $3, $4, $5)", [
    user,
    password,
    licensePlates,
    type,
    operationalBase,
  ]);
  return result.rows[0].new_user_id;
}

async function registerAdmin({ user, password, accessPassword }) {
  if (accessPassword !== process.env.ADMIN_ACCESS_PASSWORD) {
    return { error: "Contraseña de acceso incorrecta" };
  }
  const result = await query("SELECT register_admin($1, $2)", [user, password]);
  return result.rows[0].new_user_id;
}

const service = {
  userExists,
  registerOperator,
  registerAmbulance,
  registerAdmin,
};

export default service;

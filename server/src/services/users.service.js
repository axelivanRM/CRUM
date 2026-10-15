import { query } from "../config/database.js";
import {applyHash} from '../utils/hash.js';

async function userExists(username, role) {
  const result = await query("SELECT user_exists($1, $2)", [username, role]);
  return result.rows[0].user_exists;
}

async function registerOperator({ user, password, name, headquarters }) {

  const hashedPassword = await applyHash(password);

  const result = await query("SELECT register_operator($1, $2, $3, $4)", [
    user,
    hashedPassword,
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

  const hashedPassword = await applyHash(password); 

  const result = await query("SELECT register_ambulance($1, $2, $3, $4, $5)", [
    user,
    hashedPassword,
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

  const hashedPassword = await applyHash(password);

  const result = await query("SELECT register_admin($1, $2)", [user, hashedPassword]);
  return result.rows[0].new_user_id;
}

const service = {
  userExists,
  registerOperator,
  registerAmbulance,
  registerAdmin,
};

export default service;

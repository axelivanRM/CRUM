import { query } from "../config/database.config.js";
import crypto from "crypto";
import { verifyHash } from "../utils/hash.js";

async function login({ user, password }) {
  console.log(user, password);
  //validate user and password in the database
  const textQueryUsers = `SELECT user_id, username, password, totp_enabled, totp_secret_encrypted FROM users
                            WHERE username = $1`;

  const paramsQueryUsers = [user];
  const resultQueryUsers = await query(textQueryUsers, paramsQueryUsers);

  // If the user is not found or the password is invalid, throw an error
  if (resultQueryUsers.rows.length === 0) {
    throw new Error(
      "Verifica tus credenciales o pide a tu administrador que te registre",
    );
  }

  //verify the password using the verify function from hash.js
  const isPasswordValid = await verifyHash(
    resultQueryUsers.rows[0].password,
    password,
  );

  if (!isPasswordValid) {
    throw new Error(
      "Verifica tus credenciales o pide a tu administrador que te registre",
    );
  }

  //if the user is found, generate a token and store it in the sessions table
  const token = crypto.randomBytes(32).toString("hex");
  console.log("Token generado:", token);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours in milliseconds to prove it

  const textQuerySesiones = `INSERT INTO sessions (user_id, token, expires_at)
                                   VALUES ($1, $2,$3) RETURNING session_id, token as hashedToken, expires_at`;
  const paramsQuerySesiones = [
    resultQueryUsers.rows[0].user_id,
    hashedToken,
    expiresAt,
  ];
  const resultQuerySesiones = await query(
    textQuerySesiones,
    paramsQuerySesiones,
  );

  return {
    id: resultQueryUsers.rows[0].user_id,
    user: resultQueryUsers.rows[0].username,
    token: token,
    expiresAt: resultQuerySesiones.rows[0].expires_at,
  };
}

async function validateToken(token) {
  //check if the token is provided
  if (!token) {
    throw new Error("Token no proporcionado");
  }

  console.log("validate token" + token)
  //hash the token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //recover the token of the database
  const textQuery = `SELECT users.user_id, expires_at, role FROM sessions 
                             JOIN users ON users.user_id = sessions.user_id
                             WHERE token = $1 AND expires_at > NOW()`;
  const paramsQuery = [hashedToken];
  const resultQuery = await query(textQuery, paramsQuery);

  console.log("pepe" + resultQuery.rows.length);


  //check if the token is valid
  if (resultQuery.rows.length === 0) {
    return null;
  }
  
  return {
    id: resultQuery.rows[0].user_id,
    role: resultQuery.rows[0].role,
    expiresAt: resultQuerySesiones.rows[0].expires_at,
  };
}

const service = { login, validateToken };

export default service;

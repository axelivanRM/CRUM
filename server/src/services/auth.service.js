import { query } from "../config/database.js";
import crypto from "crypto";
import { verifyHash } from "../utils/hash.js";

async function login({ user, password }) {
  //validate user and password in the database
  const textQueryUsers = `SELECT user_id, username, password_hash FROM users
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
    resultQueryUsers.rows[0].password_hash,
    password,
  );

  if (!isPasswordValid) {
    throw new Error(
      "Verifica tus credenciales o pide a tu administrador que te registre",
    );
  }

  //if the user is found, generate a token and store it in the sessions table
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 1 * 10 * 60 * 1000); // 10 minutes in milliseconds to prove it

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

const service = { login };

export default service;

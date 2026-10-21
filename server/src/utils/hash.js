import { verify, hash } from "@node-rs/argon2";
import { argon2 } from "../config/argon2.config.js";

export async function applyHash(password) {
  return await hash(password, argon2);
}

export async function verifyHash(storedHash, password) {
  try {
    return await verify(storedHash, password);
  } catch {
    return false;
  }
}

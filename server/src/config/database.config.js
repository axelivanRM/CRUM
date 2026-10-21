import postgresql from "pg";

const { Pool } = postgresql;

const pool = new Pool({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

pool.on("error", (err) => {
  console.error("Database error:", err);
});

export const query = (text, params) => pool.query(text, params);

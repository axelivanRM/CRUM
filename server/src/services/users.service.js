import { query, withTransaction } from "../config/database.config.js";
import { applyHash } from "../utils/hash.js";

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
  const hashedPassword = await applyHash(password);

  try {
    return await withTransaction(async (client) => {
      // Create the user account and retrieve its generated ID.
      const resultUser = await client.query(
        `INSERT INTO users (username, password, role)
    VALUES ($1, $2, 1)
    RETURNING user_id`,
        [username, hashedPassword],
      );

      //get the user id
      const userId = resultUser.rows?.[0]?.user_id;

      // Stop if the user account was not created.
      if (!userId) {
        throw new Error("USER_INSERT_FAILED");
      }

      // Create an ambulance record linked to the newly created user.
      const resultAmbulances = await client.query(
        `INSERT INTO ambulances (ambulance_id, license_plate, ambulance_type, operating_base)
    VALUES ($1, $2, $3, $4)
    RETURNING ambulance_id, license_plate, ambulance_type, operating_base`,
        [userId, licensePlates, ambulanceType, operationalBase],
      );

      //get data ambulances
      const ambulance = resultAmbulances.rows?.[0];

      if (!ambulance) {
        throw new Error("AMBULANCE_INSERT_FAILED");
      }
      return {
        success: true,
        username: username,
        ambulance: [ambulance],
      };
    });
  } catch (error) {
    console.error("[registerAmbulance]", error);

    if (error.message === "USER_INSERT_FAILED") {
      return { success: false, message: "Insert user in database failed" };
    }

    if (error.message === "AMBULANCE_INSERT_FAILED") {
      return { success: false, message: "Insert ambulance in database failed" };
    }

    return {
      success: false,
      message: "Internal error in registerAmbulance function",
    };
  }
}

async function registerOperator({
  username,
  password,
  fullName,
  headquarters,
}) {
  const hashedPassword = await applyHash(password);

  try {
    return await withTransaction(async (client) => {
      // Create the user account and retrieve its generated ID.
      const resultUser = await client.query(
        `INSERT INTO users (username, password, role)
    VALUES ($1, $2, 2)
    RETURNING user_id`,
        [username, hashedPassword],
      );

      //get the user id
      const userId = resultUser.rows?.[0]?.user_id;

      // Stop if the user account was not created.
      if (!userId) {
        throw new Error("USER_INSERT_FAILED");
      }

      // Create an operator record linked to the newly created user.
      const resultOperator = await client.query(
        `INSERT INTO operators (operator_id, full_name, headquarters)
    VALUES ($1, $2, $3)
    RETURNING operator_id, full_name, headquarters`,
        [userId, fullName, headquarters],
      );

      const operator = resultOperator.rows?.[0];

      if (!operator) {
        throw new Error("OPERATOR_INSERT_FAILED");
      }
      return {
        success: true,
        username: username,
        operator: [operator],
      };
    });
  } catch (error) {
    console.error("[registerOperator]", error);

    if (error.message === "USER_INSERT_FAILED") {
      return { success: false, message: "Insert user  in data base failed" };
    }
    if (error.message === "OPERATOR_INSERT_FAILED") {
      return { success: false, message: "Insert operator in data base failed" };
    }
    return {
      success: false,
      message: "Internal error in registerOperator function",
    };
  }
}

async function registerAdmin({ username, password }) {
  const hashedPassword = await applyHash(password);

  try {
    // Create the user account and retrieve its generated ID.
    const resultUser = await query(
      `INSERT INTO users (username, password, role)
    VALUES ($1, $2, 3)
    RETURNING user_id`,
      [username, hashedPassword],
    );

    const admin = resultUser.rows?.[0];

    if (!admin) {
      throw new Error("ADMIN_INSERT_FAILED");
    }

    return {
      success: true,
      username: username,
      admin: [admin],
    };
  } catch (error) {
    console.error("[admin]", error);
    if (error.message === "ADMIN_INSERT_FAILED") {
      return { success: false, message: "Insert admin in data base failed" };
    }
  }
}

async function adminExists() {
  const textQuery = `SELECT EXISTS(SELECT 1 FROM users WHERE role = 3) AS exists`;
  const resultQuery = await query(textQuery);

  return resultQuery.rows[0].exists;
}

const service = {
  userExists,
  registerOperator,
  registerAmbulance,
  registerAdmin,
  adminExists,
};

export default service;

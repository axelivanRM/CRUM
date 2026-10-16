import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { query } from "./config/database.js";

import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error-handler.middleware.js";

import registerUserRoutes from "./routes/registerUserRoutes.js";
import userRoutes from "./routes/users.route.js";
import emergenciesRoutes from "./routes/emergencies.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/register/user", registerUserRoutes);
app.use("/users", userRoutes);
app.use("/emergencies", emergenciesRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar el servidor y verificar la conexión a la base de datos
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    await query("SELECT 1");
  } catch (error) {
    console.error(error.message);
  }
}

startServer();

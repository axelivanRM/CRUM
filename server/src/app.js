import "dotenv/config";
import express from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";

import { query } from "./config/database.config.js";
import params, { initParams } from "./config/params.config.js";

import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import { initializeSockets } from "./sockets/index.js";

import userRoutes from "./routes/users.route.js";
import authRoutes from "./routes/auth.route.js";
import emergenciesRoutes from "./routes/emergencies.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/emergencies", emergenciesRoutes);

// testing route for testing the server connection with next
app.get("/saludo", (req, res) => {
  const x = "hola como estas";
  console.log("📤 Enviando saludo al cliente:", x);
  res.json({ mensaje: x });
});
// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// An HTTP server is created so that Express can handle requests,
const httpServer = http.createServer(app);

// An socket server is created to get hook into the HTTP server and handle WebSocket connections
//so that socket can transform the HTTP request into a WebSocket request.
initializeSockets(httpServer);

// Iniciar el servidor y verificar la conexión a la base de datos
async function startServer() {
  try {
    httpServer.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });

    await query("SELECT 1");
    console.log("Database connection successful");

    await initParams();
    console.log("Initialized parameters:", params);
  } catch (error) {
    console.error(error.message);
  }
}

startServer();

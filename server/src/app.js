import "dotenv/config";
import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import helmet from "helmet";
import cors from "cors";

import { query } from "./config/database.js";

import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import authenticateSocket from "./sockets/authWebSocket.middleware.js";
import onConnection from "./sockets/socket.connection.handler.js";

import userRoutes from "./routes/users.route.js";
import authRoutes from "./routes/auth.route.js";
import emergenciesRoutes from "./routes/emergencies.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/emergencies", emergenciesRoutes);
// testing route for testing the server connection with next
app.get('/saludo', (req, res) => {
    const x = 'hola como estas';
    console.log('📤 Enviando saludo al cliente:', x);
    res.json({ mensaje: x });
});
// Manejo de errores
app.use(notFound);
app.use(errorHandler);


// An HTTP server is created so that Express can handle requests, 
const httpServer = http.createServer(app);

// An socket server is created to get hook into the HTTP server and handle WebSocket connections
//so that socket can transform the HTTP request into a WebSocket request.
const io = new Server (httpServer, {cors:{
    origin: "*",
    methods: ["GET", "POST"]
}});


authenticateSocket(io);
onConnection(io);



// Iniciar el servidor y verificar la conexión a la base de datos
async function startServer() {
  try {
    httpServer.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    })

    await query("SELECT 1");
  } catch (error) {
    console.error(error.message);
  }
}

startServer();

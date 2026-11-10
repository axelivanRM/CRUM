import { Server } from "socket.io";
import middleware from "./middleware/session.middleware.js";
import connectionManager from "./managers/connection.manager.js";

let io;

// Initialize the Socket.IO server
export function initializeSockets(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware for socket connections
  io.use(middleware.authenticateSession);

  // Connections management
  io.on("connection", (socket) => {
    connectionManager.register(socket);
  });

  return io;
}

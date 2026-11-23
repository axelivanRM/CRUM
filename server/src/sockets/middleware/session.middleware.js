import service from "../../services/auth.service.js";
import crypto from "crypto";

async function authenticateSession(socket, next) {
  if (socket.handshake.auth?.test) {
    socket.user = {
      id: socket.handshake.auth?.id,
      role: socket.handshake.auth?.role,
    };
    next();
    return;
  }
  // Get the token from the socket handshake
  const token = socket.handshake.auth?.token;

  if (!token) {
    return {
      success: false,
      message: "token not provided",
    };
  }

  console.log(token);
  // Check if the token is valid and get the user data
  const user = await service.validateToken(token);

  console.log(user);

  if (user == false) {
    return {
      success: false,
      message: "Token invalidated",
    };
  }

  // Attach the user data to the socket object
  socket.user = user;

  next();
}

const middleware = {
  authenticateSession,
};

export default middleware;

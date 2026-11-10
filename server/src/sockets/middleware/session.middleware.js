import service from "../../services/auth.service.js";

async function authenticateSession(socket, next) {
  // Get the token from the socket handshake
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Token no proporcionado"));
  }

  // Check if the token is valid and get the user data
  const user = await service.validateToken(token);

  // Attach the user data to the socket object
  socket.user = user;

  next();
}

const middleware = {
  authenticateSession,
};

export default middleware;

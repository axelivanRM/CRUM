import service from "../../services/auth.service.js";
import crypto from "crypto";

async function authenticateSession(socket, next) {

  if (socket.handshake.auth?.test) {
    console.log(socket.handshake.auth?.test);
    console.log("hsxjha");
    authenticateSessionTEST(socket, next);
    next();
    return;
  }
  // Get the token from the socket handshake
  const token = socket.handshake.auth?.token;
  console.log("token mal");

  if (!token) {
    return next(new Error("Token no proporcionado"));
  }

  console.log(token)
  // Check if the token is valid and get the user data
  const user = await service.validateToken(token);

  console.log(user);

if (user == null) {
    console.log("Autenticación rechazada: usuario inexistente");
    const error = new Error("Usuario no encontrado o sesión inválida");
    error.data = {
        code: "USER_NOT_FOUND",
        message: "No fue posible identificar al usuario."
    };

    return next(error);
}

  // Attach the user data to the socket object
  socket.user = user;

  next();
}

async function authenticateSessionTEST(socket) {
  socket.user = {
    id: crypto.randomUUID(),
    role: 1,
  };
}

const middleware = {
  authenticateSession,
  authenticateSessionTEST,
};

export default middleware;

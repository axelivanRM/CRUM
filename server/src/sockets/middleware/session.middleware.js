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

  if (!token) {
    return {
      success: false,
      message: "token not provided"
    };
  }

  console.log(token)
  // Check if the token is valid and get the user data
  const user = await service.validateToken(token);

  console.log(user);

if (user == false) {
  return{
    success: false,
    message: "Token invalidated"
  }
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

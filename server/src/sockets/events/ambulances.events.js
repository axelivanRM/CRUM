import handler from "../handlers/ambulance.handler.js";

// Events for ambulance socket connections
function events(socket) {
  socket.on("ambulance:status", (data) => {
    handler.status(socket, data);
  });

   socket.on("disconnect", () => {
    handler.disconnect(socket);
  });
}

export default events;

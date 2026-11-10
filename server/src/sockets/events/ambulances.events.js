import handler from "../handlers/ambulance.handler.js";

// Events for ambulance socket connections
function events(socket) {
  socket.on("ambulance:status", (data) => {
    handler.status(socket, data);
  });
}

export default events;

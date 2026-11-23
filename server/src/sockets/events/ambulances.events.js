import handler from "../handlers/ambulance.handler.js";

// Events for ambulance socket connections
function events(socket) {
  socket.on("ambulance:data.update", (data) => {
    handler.dataUpdate(socket, data);
  });

  socket.on("disconnect", () => {
    handler.disconnect(socket);
  });
}

export default events;

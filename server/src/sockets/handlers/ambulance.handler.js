import ambulances from "../../config/ambulances.config.js";

// On data update, update the ambulance map
function dataUpdate(socket, data) {
  ambulances.set(socket.user.id, data);

  console.log(ambulances);
}

function disconnect(socket) {
  ambulances.delete(`user:${socket.user.id}`);
}

const handler = {
  dataUpdate,
  disconnect,
};

export default handler;

import ambulances from "../../config/ambulances.config.js";

// On status update, update the ambulance map
async function status(socket, data) {
  if (data.status === "unavailable") {
    ambulances.delete(socket.user.id);
  } else {
    ambulances.set(socket.user.id, data);
  }

  console.log("-----------------------------------------------", data);
}

function disconnect(socket) {
  ambulances.delete(socket.user.id);
  console.log(ambulances)
}

const handler = {
  status,
  disconnect,
};

export default handler;

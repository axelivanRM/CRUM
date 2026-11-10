import ambualances from "../../config/ambulances.config.js";

// On status update, update the ambulance map
async function status(socket, data) {
  if (data.status === "unavailable") {
    ambualances.delete(socket.user.id);
  } else {
    ambualances.set(socket.user.id, data);
  }

  console.log("Ambulance status updated:", data);
}

const handler = {
  status,
};

export default handler;

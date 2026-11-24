import {setAmbulance, deleteAmbulance, getAmbulances} from "../../config/ambulances.config.js";

// On data update, update the ambulance map
function dataUpdate(socket, data) {
  setAmbulance(socket.user.id, data);

  //console.log(getAmbulances());
}

function disconnect(socket) {
  deleteAmbulance(socket.user.id);
}

const handler = {
  dataUpdate,
  disconnect,
};

export default handler;

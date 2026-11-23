import ambulances from "../../config/ambulances.config.js";
import {query} from "../../config/database.config.js"

// On status update, update the ambulance map
async function status(socket, data) {
  if (data.status === "unavailable") {
    ambulances.delete(socket.user.id);
  } else {

    if(!data.test){
      //Get data of ambulance for socket.user.id
      const textQueryAmbulance = `SELECT license_plate, ambulance_type, operating_base
                                  FROM ambulances WHERE ambulance_id = $1`;
      const paramsQueryAmbulances = [socket.user.id];
      const resultQuery = query(textQueryAmbulance, paramsQueryAmbulances);
      
      const ambulanceData = {
        resultQuery,
        status: data.status,
        location: data,
        timestamp: Date.now()
      } 
      ambulances.set(socket.user.id, ambulanceData);
    }
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

import params from "../config/params.config.js";
import h3 from "h3-js";
import geoFunctions from "../utils/geo-functions.js";
import { setAmbulance, getAmbulances } from "../config/ambulances.config.js";



function matchAmbulances(requestedAmbulances, availableAmbulances, pending) {
  const ambulanceTypes = {
    TRANSPORT: 1,
    BASIC: 2,
    ADVANCED: 3,
    INTENSIVE: 4,
  };

  // Store the requested ambulance types.
  const requestedAmbulancesTypes = requestedAmbulances.map(
    (request) => request.ambulanceType,
  );

  // Initialize the result.
  const result = {
    pending,
    types: {},
  };

  // Initialize the requested ambulance types.
  for (const request of requestedAmbulances) {
    result.types[request.ambulanceType] = {
      pending: request.quantity,
      matches: [],
      alternatives: [],
    };
  }

  // Iterate through the available ambulances and match them to the requested types.
  for (const ambulance of availableAmbulances) {
    const currentAmbulanceType = ambulance.ambulanceType;

    // If the current ambulance type is one of the requested types.
    if (requestedAmbulancesTypes.includes(currentAmbulanceType)) {

      // Add the ambulance to the matches list.
      (result.types[currentAmbulanceType].matches ??= []).push(ambulance);

      // Decrement the pending count if there are still pending ambulances of that type.
      if (result.types[currentAmbulanceType].pending > 0) {
        result.types[currentAmbulanceType].pending--;
        result.pending--;
      }

    } else {

      // Find the nearest requested ambulance type.
      const nearestAmbulanceType = requestedAmbulancesTypes.reduce(
        (nearest, type) => {

          const currentDifference = Math.abs(
            ambulanceTypes[type] - ambulanceTypes[currentAmbulanceType],
          );

          const nearestDifference = Math.abs(
            ambulanceTypes[nearest] - ambulanceTypes[currentAmbulanceType],
          );

          // Select the closest type, or the lower type in case of a tie.
          return currentDifference < nearestDifference ||
            (currentDifference === nearestDifference &&
              ambulanceTypes[type] < ambulanceTypes[nearest])
            ? type
            : nearest;
        },
      );

      // Add the ambulance to the alternatives list.
      (result.types[nearestAmbulanceType].alternatives ??= []).push(
        ambulance,
      );
    }
  }

  return result;
}


export async function algorithm(emergencie) {
  const ambulances = getAmbulances();

  const startTime = Date.now(); // ELIMINAR EN PRODUCCION
  // Initialize grids array to store ambulances by H3 cell distance from the emergency.
  const grids = new Map();

  // Calculate grid distances and linear distances for each ambulance relative to the emergency.
  for (const [_, ambulance] of ambulances) {
    const distance = h3.gridDistance(
      ambulance.data.location.h3Index,
      emergencie.location.h3_index,
    );

    ambulance.data.linearDistance = geoFunctions.calculateLinearDistance(
      ambulance.data.location,
      emergencie.location,
    );

    // Initialize the grid list for this distance if it doesn't exist yet and group ambulances by their H3 cell distance from the emergency.
    (
      grids.get(distance) ?? (grids.set(distance, []), grids.get(distance))
    ).push(ambulance.data);
  }

  let googleMapsAPIRequests = 0; // ELIMINAR EN PRODUCCION

  const distances = [...grids.keys()];

  emergencie.pending = 0;
  for (const request of emergencie.ambulanceRequests) {
    emergencie.pending += request.quantity;
  }

  console.log(emergencie.pending);

  // For each distance in the grids
  for (const [distance, ambulances] of grids) {
    const currentAmbulances = ambulances;
    const nextDistance = distances[distances.indexOf(distance) + 1];
    const isLastIteration = nextDistance === undefined;
    // If the amount of ambulances in the current distance is less than the amount of ambulances left to be assigned, and it's not the last iteration, push them to the next distance and continue.
    if (currentAmbulances.length < emergencie.pending && !isLastIteration) {
      grids.get(nextDistance).push(...currentAmbulances);
      continue;
    }

    // Order by linear distance to the emergency, so that ambulances closer to the emergency are prioritized.
    currentAmbulances.sort((a, b) => a.linearDistance - b.linearDistance);

    // While there are still ambulances in the current distance
    while (currentAmbulances.length) {
      // Slice the current ambulances to the number of ambulances still to be assigned.
      let currentAmbulancesSlice = currentAmbulances.splice(
        0,
        emergencie.pending,
      );

      // Calculate ETAs for the current slice of ambulances using the Google Maps API.
      let ETAs = await geoFunctions.calculateETA_Test(
        currentAmbulancesSlice,
        emergencie.location,
      );
      googleMapsAPIRequests += currentAmbulancesSlice.length; // ELIMINAR EN PRODUCCION

      // Assign ETAs to the current slice of ambulances and sort them by ETA.
      currentAmbulancesSlice.forEach((ambulance, index) => {
        ambulance.ETA = parseInt(ETAs[index].duration, 10);
      });

      currentAmbulancesSlice.sort((a, b) => a.ETA - b.ETA);

      // Find the index of the first ambulance that exceeds the maximum allowed time and remove all ambulances after that index.
      const timeMaxIndex = currentAmbulancesSlice.findIndex(
        (ambulance) => ambulance.ETA > params.timeMaxSeconds,
      );

      let timeMaxExceeded = timeMaxIndex >= 0;

      if (timeMaxExceeded) currentAmbulancesSlice.splice(timeMaxIndex);

      // Match the current slice of ambulances to the requested ambulances and update the requested ambulances object accordingly.
      matchAmbulances(emergencie.ambulanceRequests, currentAmbulancesSlice);

      // If there are no more pending ambulances or if the maximum allowed time has been exceeded, break out of the loop.
      if (emergencie.pending == 0 || timeMaxExceeded) {
        break;
      }
    }
  }

  console.dir(emergencie.ambulanceRequests, { depth: null });

  const endTime = Date.now();
  console.log(`Algorithm executed in ${endTime - startTime} ms`);
  console.log("Google Maps API Requests: ", googleMapsAPIRequests);

  return emergencie.ambulanceRequests;
}

async function manager(emergencie) {
  const candidates = algorithm(emergencie);

  if (request.pending == candidates.pending) {
    socket.emit("server:algorithm-options", {
      emergencyId: request.emergencyId,
      message: "No se encontró una ambulancia disponible.",
      options: ["interval", "continuous"],
    });
  }
}

const service = { algorithm };

export default service;

import params from "../config/params.config.js";
import h3 from "h3-js";
import geoFunctions from "../utils/geo-functions.js";
import { generateAmbulances } from "../utils/test.js";

function matchAmbulances(requestedAmbulances, availableAmbulances) {
  // Store the requested ambulance types as an array of integers for easier comparison.
  const requestedAmbulancesTypes = Object.keys(requestedAmbulances.types).map(
    (ambulanceType) => parseInt(ambulanceType, 10),
  );

  // Iterate through the available ambulances and match them to the requested types.
  for (const ambulance of availableAmbulances) {
    const currentAmbulanceType = ambulance.type;

    // If the current ambulance type is one of the requested types.
    if (requestedAmbulancesTypes.includes(currentAmbulanceType)) {
      // Initialize the candidates array for the current ambulance type if it doesn't exist yet and add the ambulance to the candidates list for that type.
      (requestedAmbulances.types[currentAmbulanceType].matches ??= []).push(
        ambulance,
      );

      // Decrement the pending count for the current ambulance type and the overall pending count if there are still pending ambulances of that type.
      if (requestedAmbulances.types[currentAmbulanceType].pending > 0) {
        requestedAmbulances.types[currentAmbulanceType].pending--;
        requestedAmbulances.pending--;
      }
    } else {
      // Otherwise, find the nearest requested ambulance type to the current ambulance type and add the ambulance to the alternatives list for that nearest type.
      const nearestAmbulanceType = requestedAmbulancesTypes.reduce(
        (nearest, type) => {
          // Calculate the absolute difference between the current ambulance type and the nearest type found so far, and the absolute difference between the current ambulance type and the current type being checked.
          const currentDifference = Math.abs(type - currentAmbulanceType);
          const nearestDifference = Math.abs(nearest - currentAmbulanceType);

          // Return the type that is closer to the current ambulance type, or if they are equal, return the one with the lower value.
          return currentDifference < nearestDifference ||
            (currentDifference === nearestDifference && type < nearest)
            ? type
            : nearest;
        },
      );

      // Initialize the alternatives array for the nearest ambulance type if it doesn't exist yet and add the ambulance to the alternatives list for that nearest type.
      (requestedAmbulances.types[nearestAmbulanceType].alternatives ??=
        []).push(ambulance);
    }
  }
}

export async function algorithm(ambulances, emergencie, requestedAmbulances) {
  const startTime = Date.now(); // ELIMINAR EN PRODUCCION
  // Initialize grids array to store ambulances by H3 cell distance from the emergency.
  const grids = new Map();

  // Calculate grid distances and linear distances for each ambulance relative to the emergency.
  for (const ambulance of ambulances) {
    const distance = h3.gridDistance(ambulance.h3_index, emergencie.h3_index);

    ambulance.linearDistance = geoFunctions.calculateLinearDistance(
      ambulance,
      emergencie,
    );

    // Initialize the grid list for this distance if it doesn't exist yet and group ambulances by their H3 cell distance from the emergency.
    (
      grids.get(distance) ?? (grids.set(distance, []), grids.get(distance))
    ).push(ambulance);
  }

  let googleMapsAPIRequests = 0; // ELIMINAR EN PRODUCCION

  const distances = [...grids.keys()];

  // For each distance in the grids
  for (const [distance, ambulances] of grids) {
    const currentAmbulances = ambulances;
    const nextDistance = distances[distances.indexOf(distance) + 1];
    const isLastIteration = nextDistance === undefined;

    // If the amount of ambulances in the current distance is less than the amount of ambulances left to be assigned, and it's not the last iteration, push them to the next distance and continue.
    if (
      currentAmbulances.length < requestedAmbulances.pending &&
      !isLastIteration
    ) {
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
        requestedAmbulances.pending,
      );

      // Calculate ETAs for the current slice of ambulances using the Google Maps API.
      let ETAs = await geoFunctions.calculateETA(
        currentAmbulancesSlice,
        emergencie,
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
      matchAmbulances(requestedAmbulances, currentAmbulancesSlice);

      // If there are no more pending ambulances or if the maximum allowed time has been exceeded, break out of the loop.
      if (requestedAmbulances.pending == 0 || timeMaxExceeded) {
        break;
      }
    }
  }

  console.dir(requestedAmbulances, { depth: null });

  const endTime = Date.now();
  console.log(`Algorithm executed in ${endTime - startTime} ms`);
  console.log("Google Maps API Requests: ", googleMapsAPIRequests);

  return requestedAmbulances;
}

algorithm(
  generateAmbulances(300),
  {
    latitude: 19.4326,
    longitude: -99.1332,
    h3_index: h3.latLngToCell(19.4326, -99.1332, 5),
  },
  {
    types: {
      1: {
        needed: 1,
        pending: 1,
      },
      3: {
        needed: 1,
        pending: 1,
      },
    },
    pending: 2,
  },
);

async function hola(request) {
  const candidates = algorithm(emergencie, request);

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

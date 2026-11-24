import params from "../config/params.config.js";
import h3 from "h3-js";
import geoFunctions from "../utils/geo-functions.js";
import ambulances from "../config/ambulances.config.js";

function matchAmbulances(requestedAmbulances, availableAmbulances) {
  // Store the requested ambulance types as an array of integers for easier comparison.
  const requestedAmbulancesTypes = Object.keys(requestedAmbulances.types);

  // Set numerical rank of ambulance types
  const ambulanceTypesRank = {
    TRANSPORT: 1,
    BASIC: 2,
    ADVANCED: 3,
    INTENSIVE: 4,
  };

  // Iterate through the available ambulances and match them to the requested types.
  for (const ambulance of availableAmbulances) {
    const currentAmbulanceType = ambulance.ambulanceType;

    // If the current ambulance type is one of the requested types.
    if (requestedAmbulancesTypes.includes(currentAmbulanceType)) {
      // Add the ambulance to the matches list for that type.
      requestedAmbulances.types[currentAmbulanceType].matches.push(ambulance);

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
          const currentDifference = Math.abs(
            ambulanceTypesRank[type] - ambulanceTypesRank[currentAmbulanceType],
          );
          const nearestDifference = Math.abs(
            ambulanceTypesRank[nearest] -
              ambulanceTypesRank[currentAmbulanceType],
          );

          // Return the type that is closer to the current ambulance type, or if they are equal, return the one with the lower value.
          return currentDifference < nearestDifference ||
            (currentDifference === nearestDifference &&
              ambulanceTypesRank[type] < ambulanceTypesRank[nearest])
            ? type
            : nearest;
        },
      );

      // Initialize the alternatives array for the nearest ambulance type if it doesn't exist yet and add the ambulance to the alternatives list for that nearest type.
      requestedAmbulances.types[nearestAmbulanceType].alternatives.push(
        ambulance,
      );
    }
  }
}

export async function algorithm(emergencie) {
  const startTime = Date.now(); // ELIMINAR EN PRODUCCION
  // Create results attribute for storing algotithm results and set the total ambulances requests pending
  emergencie.ambulances.results = {
    types: emergencie.ambulances.requests.reduce(
      (result, { ambulanceType, quantity }) => {
        result[ambulanceType] = {
          matches: [],
          alternatives: [],
          pending: quantity,
        };

        return result;
      },
      {},
    ),
    pending: emergencie.ambulances.requests.reduce(
      (sum, request) => sum + request.quantity,
      0,
    ),
  };
  /*
    emergencie.ambulances.results takes this form:

    {
      "types": {
        "TRANSPORT": {
          "matches": [],
          "alternatives": [],
          "pending": 1
        },
        "ADVANCED": {
          "matches": [],
          "alternatives": [],
          "pending": 1
        }
      },
      "pending": 2
    }
  */

  // Initialize grids array to store ambulances by H3 cell distance from the emergency.
  let grids = new Map();

  // Calculate grid distances and linear distances for each ambulance relative to the emergency.
  for (const [_, { data: ambulance }] of ambulances) {
    if (!ambulance.isReceivingAssignments) continue;

    const distance = h3.gridDistance(
      ambulance.location.h3Index,
      emergencie.location.h3_index,
    );

    ambulance.linearDistance = geoFunctions.calculateLinearDistance(
      ambulance.location,
      emergencie.location,
    );

    // Initialize the grid list for this distance if it doesn't exist yet and group ambulances by their H3 cell distance from the emergency.
    (
      grids.get(distance) ?? (grids.set(distance, []), grids.get(distance))
    ).push(ambulance);
  }

  // Order grids map keys by distances
  grids = new Map(
    [...grids.entries()].sort(
      ([distanceA], [distanceB]) => distanceA - distanceB,
    ),
  );

  let googleMapsAPIRequests = 0; // ELIMINAR EN PRODUCCION

  const distances = [...grids.keys()];

  // For each distance in the grids
  for (const [distance, ambulances] of grids) {
    const currentAmbulances = ambulances;
    const nextDistance = distances[distances.indexOf(distance) + 1];
    const isLastIteration = nextDistance === undefined;

    // If the amount of ambulances in the current distance is less than the amount of ambulances left to be assigned, and it's not the last iteration, push them to the next distance and continue.
    if (
      currentAmbulances.length < emergencie.ambulances.results.pending &&
      !isLastIteration
    ) {
      grids.get(nextDistance).push(...currentAmbulances);
      continue;
    }

    // Order by linear distance to the emergency, so that ambulances closer to the emergency are prioritized.
    currentAmbulances.sort((a, b) => a.linearDistance - b.linearDistance);

    // ETA time exceeded flag
    let isTimeMaxExceeded = false;

    // While there are still ambulances in the current distance
    while (currentAmbulances.length) {
      // Slice the current ambulances to the number of ambulances still to be assigned.
      let currentAmbulancesSlice = currentAmbulances.splice(
        0,
        emergencie.ambulances.results.pending,
      );

      // Calculate ETAs for the current slice of ambulances using the Google Maps API.
      let ETAs = await geoFunctions.calculateETA_Test(
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

      isTimeMaxExceeded = timeMaxIndex >= 0;

      if (isTimeMaxExceeded) currentAmbulancesSlice.splice(timeMaxIndex);

      // Match the current slice of ambulances to the requested ambulances and update the requested ambulances object accordingly.
      matchAmbulances(emergencie.ambulances.results, currentAmbulancesSlice);

      // If there are no more pending ambulances or if the maximum allowed time has been exceeded, break out of the current ambulance distance ring.
      if (emergencie.ambulances.results.pending === 0 || isTimeMaxExceeded) {
        break;
      }
    }

    // If there are no more pending ambulances or if the maximum allowed time has been exceeded, stop iteration to the other distances rings.
    if (emergencie.ambulances.results.pending === 0 || isTimeMaxExceeded) {
      break;
    }
  }

  console.dir(emergencie, { depth: null });

  const endTime = Date.now();
  console.log(`Algorithm executed in ${endTime - startTime} ms`);
  console.log("Google Maps API Requests: ", googleMapsAPIRequests);

  return emergencie;
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

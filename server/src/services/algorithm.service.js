import { gridDistance, latLngToCell } from "h3-js";

// Coordenadas aproximadas del área urbana de Ciudad de México.
const CDMX_BOUNDS = {
  minLat: 19.2,
  maxLat: 19.6,
  minLong: -99.36,
  maxLong: -98.94,
};

/** Calcula la distancia geodésica entre dos puntos (en metros) con Haversine. */
export function calculateLinearDistance(pointA, pointB) {
  const earthRadiusMeters = 6_371_000;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const latitudeDifference = toRadians(pointB.latitude - pointA.latitude);
  const longitudeDifference = toRadians(pointB.longitude - pointA.longitude);
  const latitudeA = toRadians(pointA.latitude);
  const latitudeB = toRadians(pointB.latitude);

  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitudeA) *
      Math.cos(latitudeB) *
      Math.sin(longitudeDifference / 2) ** 2;

  return (
    2 *
    earthRadiusMeters *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

/**
 * Construye el cuerpo para Routes API computeRouteMatrix.
 * Cada ambulancia es un origen y la emergencia es el destino común.
 */
export async function calculateETA(ambulances, emergencie) {
  const request = {
    origins: ambulances.map((ambulance) => ({
      waypoint: {
        location: {
          latLng: {
            latitude: ambulance.latitude,
            longitude: ambulance.longitude,
          },
        },
      },
    })),
    destinations: [
      {
        waypoint: {
          location: {
            latLng: {
              latitude: emergencie.latitude,
              longitude: emergencie.longitude,
            },
          },
        },
      },
    ],
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_UNAWARE", // CAMBIAR A TRAFFIC_AWARE EN PRODUCCIÓN
  };

  const response = await fetch(
    "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "AIzaSyBksqj-6lqhuwEca-WStJZrc5UumeDni8k",
        "X-Goog-FieldMask": "originIndex,duration",
      },
      body: JSON.stringify(request),
    },
  );

  return await response.json();
}

/**
 * Genera ambulancias de prueba distribuidas aleatoriamente en CDMX.
 * La resolución H3 9 representa celdas urbanas de unos cientos de metros.
 */
export function generateAmbulances(count = 10) {
  return Array.from({ length: count }, (_, index) => {
    const latitude =
      CDMX_BOUNDS.minLat +
      Math.random() * (CDMX_BOUNDS.maxLat - CDMX_BOUNDS.minLat);
    const longitude =
      CDMX_BOUNDS.minLong +
      Math.random() * (CDMX_BOUNDS.maxLong - CDMX_BOUNDS.minLong);

    return {
      latitude,
      longitude,
      h3_index: latLngToCell(latitude, longitude, 5),
      ambulanceType: Math.floor(Math.random() * 4) + 1,
      id_socket: `ambulance-${index + 1}`,
    };
  });
}

function assignCandidates(requestedAmbulances, availableAmbulances) {
  // Requested types are the keys of `requested`; convert them to numbers
  // so they can be compared with `ambulanceType`.
  const requestedAmbulancesTypes = Object.keys(
    requestedAmbulances.requested,
  ).map((ambulanceType) => parseInt(ambulanceType, 10));

  for (const ambulance of availableAmbulances) {
    const currentAmbulanceType = ambulance.ambulanceType;

    if (requestedAmbulancesTypes.includes(currentAmbulanceType)) {
      // An exact type match is saved as a candidate and counts toward
      // fulfilling the ambulance request.
      requestedAmbulances.requested[currentAmbulanceType].candidates ??= [];
      requestedAmbulances.requested[currentAmbulanceType].candidates.push(
        ambulance,
      );

      if (
        requestedAmbulances.requested[currentAmbulanceType].toBeAssigned > 0
      ) {
        requestedAmbulances.requested[currentAmbulanceType].toBeAssigned--;
        requestedAmbulances.toBeAssigned--;
      }
    } else {
      // Otherwise, find the requested type with the smallest difference;
      // if tied, prefer the lower type.
      const nearestAmbulanceType = requestedAmbulancesTypes.reduce(
        (nearest, type) => {
          const currentDifference = Math.abs(type - currentAmbulanceType);
          const nearestDifference = Math.abs(nearest - currentAmbulanceType);

          return currentDifference < nearestDifference ||
            (currentDifference === nearestDifference && type < nearest)
            ? type
            : nearest;
        },
      );

      // Approximate type matches are stored as alternatives and do not
      // reduce the number of ambulances still to be assigned.
      requestedAmbulances.requested[nearestAmbulanceType].alternatives ??= [];
      requestedAmbulances.requested[nearestAmbulanceType].alternatives.push(
        ambulance,
      );
    }
  }
}

export async function algorithm() {
  const timeMax = 30 * 60; // 30 minutes in milliseconds
  const startTime = Date.now();
  const ambulances = generateAmbulances();
  const emergencie = {
    latitude: 19.4326,
    longitude: -99.1332,
    h3_index: latLngToCell(19.4326, -99.1332, 5),
  };
  const requestedAmbulances = {
    requested: {
      3: {
        quantity: 1,
        toBeAssigned: 1,
      },
    },
    toBeAssigned: 1,
  };
  const cells = {};

  // Cell distance and linear distance
  for (const ambulance of ambulances) {
    const distance = gridDistance(ambulance.h3_index, emergencie.h3_index);

    ambulance.linearDistance = calculateLinearDistance(ambulance, emergencie);

    cells[distance] = cells[distance] || [];
    cells[distance].push(ambulance);
  }

  let ambulancesStack = [];
  let googleMapsAPIRequests = 0;

  const distances = Object.keys(cells);
  const lastDistance = distances[distances.length - 1];

  // For each distance in cells
  for (const distance in cells) {
    const currentAmbulances = cells[distance];
    const isLastIteration = distance === lastDistance;

    // If the sum of ambulances in the cell and ambulancesStack is below the amount of ambulances to be assigned, then push in the ambulancesStack and continue
    if (
      currentAmbulances.length + ambulancesStack.length <
        requestedAmbulances.toBeAssigned &&
      !isLastIteration
    ) {
      ambulancesStack.push(...currentAmbulances);
      continue;
    } else {
      currentAmbulances.push(...ambulancesStack);
      ambulancesStack = [];
    }

    // Order by linear distance
    currentAmbulances.sort((a, b) => a.linearDistance - b.linearDistance);

    // Send request of n-m ambulances to Google Route API
    /*
    for (
      let i = 0;
      i <
      Math.ceil(currentAmbulances.length / requestedAmbulances.toBeAssigned);
      i++
    ) */
    while (currentAmbulances.length) {
      //let currentSliceStart = i * requestedAmbulances.toBeAssigned;
      //let currentSliceEnd = (i + 1) * requestedAmbulances.toBeAssigned;
      let currentAmbulancesSlice = currentAmbulances.splice(
        0,
        requestedAmbulances.toBeAssigned,
      );

      let ETAs = await calculateETA(currentAmbulancesSlice, emergencie);
      googleMapsAPIRequests += currentAmbulancesSlice.length;

      let timeMaxExceeded = false;

      for (let index = 0; index < currentAmbulancesSlice.length; index++) {
        currentAmbulancesSlice[index].ETA = parseInt(ETAs[index].duration, 10);
      }

      currentAmbulancesSlice.sort((a, b) => a.ETA - b.ETA);

      for (let index = 0; index < currentAmbulancesSlice.length; index++) {
        if (currentAmbulancesSlice[index].ETA > timeMax) {
          currentAmbulancesSlice.splice(index);
          timeMaxExceeded = true;
          break;
        }
      }

      assignCandidates(requestedAmbulances, currentAmbulancesSlice);

      if (requestedAmbulances.toBeAssigned == 0 || timeMaxExceeded) {
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

algorithm();

const service = { generateAmbulances, calculateLinearDistance, calculateETA };

export default service;

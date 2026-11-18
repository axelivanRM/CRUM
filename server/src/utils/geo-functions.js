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

export function calculateETA_Test(ambulances, emergencie) {
  const ETAs = ambulances.map((ambulance) => {
    const distance = calculateLinearDistance(
      { latitude: ambulance.latitude, longitude: ambulance.longitude },
      { latitude: emergencie.latitude, longitude: emergencie.longitude },
    );
    const averageSpeed = 15;
    const duration = (distance / averageSpeed) * 60;
    return { originIndex: ambulances.indexOf(ambulance), duration };
  });
  return ETAs;
}

const geoFunctions = {
  calculateLinearDistance,
  calculateETA,
  calculateETA_Test,
};

export default geoFunctions;

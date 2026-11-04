import h3 from "h3-js";

/**
 * Genera ambulancias de prueba distribuidas aleatoriamente en CDMX.
 * La resolución H3 9 representa celdas urbanas de unos cientos de metros.
 */
export function generateAmbulances(count = 300) {
  const CDMX_BOUNDS = {
    minLat: 19.2,
    maxLat: 19.6,
    minLong: -99.36,
    maxLong: -98.94,
  };

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
      h3_index: h3.latLngToCell(latitude, longitude, 5),
      type: Math.floor(Math.random() * 4) + 1,
      id_socket: `ambulance-${index + 1}`,
    };
  });
}

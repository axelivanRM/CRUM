import { algorithm } from "../src/services/algorithm.service.js";
import { generateAmbulances } from "../src/utils/test.js";
import h3 from "h3-js";

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

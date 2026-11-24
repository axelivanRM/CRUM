import { algorithm } from "../src/services/algorithm.service.js";
import { generateAmbulances } from "../src/utils/test.js";
import h3 from "h3-js";

algorithm(
{
  "contactPhone": "5635049272",
  "emergencyType": "HIGH",
  "description": "Patient injured in a traffic accident",
  "location": {
    "latitude": 19.5102018,
    "longitude": -99.1258884,
    "h3_index": "894995b98b7ffff"
  },
  "ambulanceRequests": [
    {
      "ambulanceType": "TRANSPORT",
      "quantity": 5
    },
    {
      "ambulanceType": "ADVANCED",
      "quantity": 10
    }
  ],
  "ignoreDuplicates": false
}
);

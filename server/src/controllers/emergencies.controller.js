import service from "../services/emergencies.service.js";

// Create a new emergency
async function newEmergency(req, res) {
  const result = await service.createEmergency(req.body);

  if (!result) {
    return res.status(500).json({ error: "Error al crear la emergencia" });
  }

  return res
    .status(201)
    .json({ message: "Emergencia creada exitosamente", emergency_id: result });
}

const controller = { newEmergency };

export default controller;

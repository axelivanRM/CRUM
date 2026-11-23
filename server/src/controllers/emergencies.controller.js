import service from "../services/emergencies.service.js";

// Create a new emergency
async function newEmergency(req, res) {
  const duplicates = await service.findDuplicateEmergency(req.body);

  if (duplicates && !req.body.ignoreDuplicates) {
    return res.status(409).json({
      success: false,
      message: "La emergencia podría estar duplicada",
      error: { duplicates },
    });
  }

  const data = await service.newEmergency(req.body);

  return res.status(201).json({
    success: true,
    message: "Emergencia creada exitosamente",
    data,
  });
}

const controller = { newEmergency };

export default controller;

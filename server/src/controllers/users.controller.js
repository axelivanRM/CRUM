import service from "../services/users.service.js";

async function register(req, res) {
  const data = req.body;
  let result;

  switch (req.params.role) {
    case "ambulance":
      result = await service.registerAmbulance(data);
      break;
    case "operator":
      result = await service.registerOperator(data);
      break;
    case "admin":
      result = await service.registerAdmin(data);
      break;
    default:
      return res.status(400).json({ error: "Rol no válido" });
  }

  if (!result) {
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }

  return res.status(201).json({ message: "Usuario registrado exitosamente" });
}

const controller = { register };

export default controller;

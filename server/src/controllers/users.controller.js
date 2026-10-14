import service from "../services/users.service.js";

async function register(req, res) {
  const data = req.body;
  let result;

  switch (data.role) {
    case 1:
      result = await service.registerAmbulance(data);
      break;
    case 2:
      result = await service.registerOperator(data);
      break;
    case 3:
      result = await service.registerAdmin(data);
      break;
    default:
      return res.status(400).json({ error: "Rol no válido" });
  }

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ message: "Usuario registrado exitosamente" });
}

const controller = { register };

export default controller;

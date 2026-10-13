import {
  registerUserAdmin,
  registerUserAmbulance,
  registerUserOperator,
} from "../services/users.service.js";

async function register(req, res) {
  const data = req.body;
  let result;

  switch (data.role) {
    case "admin":
      result = await registerUserAdmin(data);
      break;
    case "operator":
      result = await registerUserOperator(data);
      break;
    case "ambulance":
      result = await registerUserAmbulance(data);
      break;
    default:
      return res.status(400).json({ error: "Rol no válido" });
  }

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ message: "Usuario registrado exitosamente" });
}

export { register };
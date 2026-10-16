import service from "../services/auth.service.js";

export async function loginController(req, res) {
  const { user, password } = req.body;

  const result = await service.login({ user, password });

  if (result.error) {
    res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ message: "Usuario autenticado exitosamente" });
}

const controller = { loginController };
export default controller;

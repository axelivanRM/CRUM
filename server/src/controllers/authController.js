import { authenticateUser } from "../services/authUserService.js";

async function getCredentialsUser(req, res) {
  const { user, userPassword } = req.body;

  try {
    const { token, user } = await authenticateUser({ user, userPassword });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      message: "Usuario autenticado correctamente",
      data: user,
    });
  } catch (error) {
    if (
      error.message ===
      "Verifica tus credenciales o pide a tu administrador que te registre"
    ) {
      return res.status(401).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error del servidor controller auth",
    });
  }
}

export { getCredentialsUser };

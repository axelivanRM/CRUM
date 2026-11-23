import service from "../services/auth.service.js";

export async function loginController(req, res) {
  const { user, password } = req.body;

  const result = await service.login({ user, password });

  if (!result) {
    return res.status(500).json({
      success: false,
      message: "Verify your credentials or ask your administrator to register you.",
      error: {
        code: "Error in login service",
        details: [
          {
            field: result,
          },
        ],
      },
    });
  }

  return res.status(201).json({
    success: true,
    message: "User successfully authenticated",
    data: {
      result,
    },
  });
}

const controller = { loginController };
export default controller;

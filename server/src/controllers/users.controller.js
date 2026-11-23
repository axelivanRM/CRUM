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
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
  }

  if (!result?.success) {
    return res.status(500).json({
      success: false,
      message: result?.message || "Error registering the user",
      error: {
        code: "Error in users services",
        details: [{field: data }],
      },
    });
  }

  return res.status(201).json({
    success: true,
    message: "User successfully registered",
    data: {
      result,
    },
  });
}

async function checkIfAdminExists(req, res) {
  try {
    const exists = await service.adminExists();
    return res.json({
      success: true,
      message: "User successfully registered",
      data: {
        admin: { exists },
      },
    });
  } catch (error) {
    console.error("Error verificando admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal error (controller users)",
    });
  }
}

const controller = { register, checkIfAdminExists };

export default controller;

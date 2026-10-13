import {
  registerUserCrum,
  registerUserAdmin,
  registerUserAmbulance,
} from "../services/registerUserService.js";

async function getCredentialAdmin(req, res) {
  try {
    const { user, userPassword, rol, accessPassword } = req.body;

    console.log(user, userPassword, rol, accessPassword);

    const result = await registerUserAdmin({
      user,
      userPassword,
      rol,
      accessPassword,
    });

    return res.status(201).json({
      status: "success",
      message: "Usuario administrador registrado correctamente",
      data: result,
    });
  } catch (error) {
    if (error.message === "clave de acceso incorrecta") {
      return res.status(401).json({
        status: "error",
        message: error.message,
      });
    }

    if (error.message === "ya existe un administrador registrado") {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error del servidor controller admin",
    });
  }
}

async function getCredentialCrum(req, res) {
  const { user, userPassword, rol, userName, headquartersCrum } = req.body;

  try {
    const result = await registerUserCrum({
      user,
      userPassword,
      rol,
      userName,
      headquartersCrum,
    });
    return res.status(201).json({
      status: "success",
      message: "Usuario crum registrado correctamente",
      data: result,
    });
  } catch (error) {
    if (error.message === "ya existe este usuario") {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error del servidor controller crum",
    });
  }
}

async function getCredentialAmbulance(req, res) {
  const {
    user,
    userPassword,
    rol,
    licensePlates,
    typeOfAmbulance,
    operationalBase,
  } = req.body;

  try {
    const result = await registerUserAmbulance({
      user,
      userPassword,
      rol,
      licensePlates,
      typeOfAmbulance,
      operationalBase,
    });

    return res.status(201).json({
      status: "success",
      message: "Usuario ambulancia registrado correctamente",
      data: result,
    });
  } catch (error) {
    if (error.message === "ya existe este usuario") {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error del servidor controller",
    });
  }
}

export { getCredentialAdmin, getCredentialCrum, getCredentialAmbulance };

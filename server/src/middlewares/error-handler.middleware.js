export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error("Error no controlado:", err);

  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
}
export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: err.detail || err.message || err || "Ocurrió un error inesperado",
  });
}
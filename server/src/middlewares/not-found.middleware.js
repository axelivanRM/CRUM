export default function notFound(_, res) {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
  });
}
import { Router } from "express";
import middleware from "../middlewares/emergencies.middleware.js";

const router = Router();

// Middleware
router.use("/new", middleware.validateEmergency);

// Routes
router.post("/new", (req, res) => {
  res.status(200).json({ message: "Formulario de emergencia" });
});

export default router;

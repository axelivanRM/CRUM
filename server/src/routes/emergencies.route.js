import { Router } from "express";
import middleware from "../middlewares/emergencies.middleware.js";
import controller from "../controllers/emergencies.controller.js";

const router = Router();

// Middleware
router.use("/new", middleware.validateEmergency);

// Controller
router.post("/new", controller.newEmergency);

export default router;

import { Router } from "express";
import middleware from "../middlewares/users.middleware.js";
import controller from "../controllers/users.controller.js";

const router = Router();

// Middleware
router.use("/register/:role", middleware.validateRegistration);

// Routes
router.post("/register/:role", controller.register);

export default router;

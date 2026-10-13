import { Router } from "express";
import { validateRegistration } from "../middlewares/register.middleware.js";
import { register } from "../controllers/users.controller.js";

const router = Router();

// Middleware
router.use("/register/:role", validateRegistration);

// Routes
router.post("/register/:role", register);

export default router;
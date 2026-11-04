import { Router } from "express";
import middleware from "../middlewares/login.middleware.js";
import controller from "../controllers/auth.controller.js";

const router = Router();

//middleware
router.use("/login", middleware.validateCredentials);

//controller
router.post("/login", controller.loginController);

// middleware


export default router;

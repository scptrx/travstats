import express from "express";
import AuthController from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middlewares/validators.js";

const router = express.Router();

// POST /auth/register
router.post("/register", validateRegister, AuthController.register);

// POST /auth/login
router.post("/login", validateLogin, AuthController.login);

// GET /auth/check
router.get("/check", AuthController.check);

export default router;
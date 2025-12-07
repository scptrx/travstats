import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

// POST /auth/register
router.post("/register", AuthController.register);

// POST /auth/login
router.post("/login", AuthController.login);

// GET /auth/check
router.get("/check", AuthController.check);

export default router;
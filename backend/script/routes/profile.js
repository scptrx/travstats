import express from "express";
import multer from "multer";
import ProfileController from "../controllers/profileController.js";
import { validateUpdateProfile } from "../middlewares/validators.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// PUT /profile/update-username
router.put("/update-username", validateUpdateProfile, ProfileController.updateUsername);

// POST /profile/upload-avatar
router.post("/upload-avatar", validateUpdateProfile, upload.single("file"), ProfileController.uploadAvatar);

export default router;
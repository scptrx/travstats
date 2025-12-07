import express from "express";
import multer from "multer";
import ProfileController from "../controllers/profileController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// PUT /profile/update-username
router.put("/update-username", ProfileController.updateUsername);

// POST /profile/upload-avatar
router.post("/upload-avatar", upload.single("file"), ProfileController.uploadAvatar);

export default router;
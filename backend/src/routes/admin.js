import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { adminAuth } from "../middlewares/adminAuth.js";
import AdminController from "../controllers/adminController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(adminAuth);

// GET /admin/dashboard
router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/admin.html"));
});

// GET /admin/profiles
router.get("/profiles", AdminController.getAllProfiles);

// PUT /admin/profiles/:id
router.put("/profiles/:id", AdminController.updateProfile);

export default router;

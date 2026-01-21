import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(adminAuth);

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/admin.html"));
});

export default router;

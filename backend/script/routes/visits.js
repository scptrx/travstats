import express from "express";
import VisitsController from "../controllers/visitsController.js";

const router = express.Router();

// POST /visits/add-country
router.post("/add-country", VisitsController.addCountry);

// DELETE /visits/:id
router.delete("/:id", VisitsController.deleteVisit);

// GET /visits/my
router.get("/my", VisitsController.getMyVisits);

export default router;
import express from "express";
import VisitsController from "../controllers/visitsController.js";
import { validateAddCountry, validateAddSubdivision, validateDeleteVisit } from "../middlewares/validators.js";    

const router = express.Router();

// POST /visits/add-country
router.post("/add-country", validateAddCountry, VisitsController.addCountry);

// POST /visits/add-subdivision
router.post("/add-subdivision", validateAddSubdivision, VisitsController.addSubdivision);

// DELETE /visits/:id
router.delete("/:id", validateDeleteVisit, VisitsController.deleteVisit);

// GET /visits/my
router.get("/my", VisitsController.getMyVisits);

export default router;
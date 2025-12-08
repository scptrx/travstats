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

// PUT /visits/:id
router.put("/:id", VisitsController.updateVisit);

// GET /visits/my
router.get("/my", VisitsController.getMyVisits);

// GET /visits/my-subdivisions/:countryCode
router.get("/my-subdivisions/:countryCode", VisitsController.getMySubdivisionVisits);

export default router;

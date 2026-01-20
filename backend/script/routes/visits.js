import express from "express";
import VisitsController from "../controllers/visitsController.js";
import { validateAddCountry, validateAddSubdivision, validateDeleteVisit, validateUpdateVisit } from "../middlewares/validators.js";

const router = express.Router();

// POST /visits/add-country
router.post("/add-country", validateAddCountry, VisitsController.addCountry);

// POST /visits/add-subdivision
router.post("/add-subdivision", validateAddSubdivision, VisitsController.addSubdivision);

// POST /visits/add-city
router.post("/add-city", VisitsController.addCity);

// DELETE /visits/:id
router.delete("/:id", validateDeleteVisit, VisitsController.deleteVisit);

// PUT /visits/:id
router.put("/:id", validateUpdateVisit, VisitsController.updateVisit);

// GET /visits/my
router.get("/my", VisitsController.getMyVisits);

// GET /visits/my-countries
router.get("/my-countries", VisitsController.getMyCountryVisits);

// GET /visits/my-subdivisions/:countryCode
router.get("/my-subdivisions/:countryCode", VisitsController.getMySubdivisionVisits);

// GET /visits/my-cities/
router.get("/my-cities", VisitsController.getMyCityVisits);

export default router;

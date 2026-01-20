import express from "express";
import GeocodingController from "../controllers/geocodingController.js";

const router = express.Router();

// GET /geocode/search?query=cityname
router.get("/search", GeocodingController.searchCities);

export default router;

import Geocode from "../models/Geocode.js";
import logger from "../utils/logger.js";

class GeocodingController {
    static async searchCities(req, res) {
        try {
            const { query } = req.query;

            if (!query || query.trim().length === 0) {
                return res.status(400).json({
                    error: "Query parameter is required"
                });
            }

            const cities = await Geocode.searchCities(query);

            res.json({
                cities,
                count: cities.length
            });
        } catch (error) {
            logger.error("Search cities error", { error: error.message });
            res.status(500).json({
                error: error.message
            });
        }
    }
}

export default GeocodingController;

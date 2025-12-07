import User from "../models/User.js";
import Visit from "../models/Visit.js";
import Country from "../models/Country.js";
import logger from "../utils/logger.js";

class VisitsController {
    static async addCountry(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const {
                country_iso_code,
                country_name,
                country_region,
                country_latitude,
                country_longitude,
                visit_date,
                notes
            } = req.body;

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            const country = await Country.getOrCreate(country_iso_code, {
                name: country_name,
                region: country_region,
                latitude: country_latitude,
                longitude: country_longitude
            });

            const existingVisit = await Visit.checkExists(user.id, country.id);

            if (existingVisit) {
                return res.status(409).json({
                    error: "Country already visited",
                    visit_id: existingVisit.id
                });
            }

            const visit = await Visit.create(user.id, country.id, visit_date, notes);

            logger.info("Country visit added", {
                user_id: user.id,
                country_iso: country_iso_code,
                country_name: country_name
            });

            res.json({ visit });
        } catch (error) {
            logger.error("Failed to add visit", { 
                error: error.message 
            });
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteVisit(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const { id } = req.params;

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            await Visit.delete(id, user.id);

            logger.info("Visit deleted", { 
                user_id: user.id, 
                visit_id: id 
            });

            res.json({ message: "Visit deleted" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getMyVisits(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            const visits = await Visit.getUserVisits(user.id);

            res.json({ visits });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default VisitsController;
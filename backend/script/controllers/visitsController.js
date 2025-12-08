import User from "../models/User.js";
import Visit from "../models/Visit.js";
import Country from "../models/Country.js";
import Subdivision from "../models/Subdivision.js";
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

    static async addSubdivision(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const {
                subdivision_code,
                subdivision_name,
                country_iso_code,
                subdivision_latitude,
                subdivision_longitude,
                visit_date,
                notes,
                type
            } = req.body;

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            const country = await Country.getByIsoCode(country_iso_code);
            if (!country) {
                return res.status(404).json({ error: "Country not found" });
            }

            const subdivision = await Subdivision.getOrCreate(subdivision_code, {
                name: subdivision_name,
                country_id: country.id,
                latitude: subdivision_latitude,
                longitude: subdivision_longitude,
                type: type
            });

            const existingVisit = await Visit.checkExists(user.id, null, subdivision.id);

            if (existingVisit) {
                return res.status(409).json({
                    error: "Subdivision already visited",
                    visit_id: existingVisit.id
                });
            }

            const visit = await Visit.create(
                user.id,
                subdivision.country_id,
                visit_date,
                notes,
                subdivision.id,
                null
            );

            logger.info("Subdivision visit added", {
                user_id: user.id,
                subdivision_code: subdivision_code,
                subdivision_name: subdivision_name
            });

            res.json({ visit });
        } catch (error) {
            logger.error("Failed to add subdivision visit", {
                error: error.message
            });
            res.status(400).json({ error: error.message });
        }
    }

    static async updateVisit(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const { id } = req.params;
            const { visit_date, notes } = req.body;

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            const updatedVisit = await Visit.update(id, user.id, {
                visit_date,
                notes
            });

            logger.info("Visit updated", {
                user_id: user.id,
                visit_id: id
            });

            res.json({ visit: updatedVisit });
        } catch (error) {
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

    static async getMySubdivisionVisits(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const { countryCode } = req.params;

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            const country = await Country.getByIsoCode(countryCode);
            if (!country) {
                return res.status(404).json({ error: "Country not found" });
            }

            const { data, error } = await Visit.getUserSubdivisionVisitsByCountry(
                user.id,
                country.id
            );

            if (error) {
                throw new Error(error.message);
            }

            res.json({ visits: data });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default VisitsController;

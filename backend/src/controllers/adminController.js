import Profile from "../models/Profile.js";
import logger from "../utils/logger.js";

class adminController {
    static async getAllProfiles(req, res) {
        try {
            const profiles = await Profile.getAll();

            logger.info("Admin fetched all profiles", {
                adminId: req.user.id,
                count: profiles.length
            });

            res.json(profiles);
        } catch (error) {
            logger.error("Error fetching profiles", { error: error.message });
            res.status(500).json({ error: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const { username, role, restricted_until } = req.body;

            if (role && !["user", "admin"].includes(role)) {
                return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
            }

            if (restricted_until && id === req.user.id) {
                return res.status(400).json({ error: "You cannot restrict yourself" });
            }

            if (role === "user" && id === req.user.id) {
                return res.status(400).json({ error: "You cannot demote yourself" });
            }

            const updatedProfile = await Profile.updateByAdmin(id, {
                username,
                role,
                restricted_until
            });

            logger.info("Admin updated profile", {
                adminId: req.user.id,
                targetUserId: id,
                changes: { username, role, restricted_until }
            });

            res.json(updatedProfile);
        } catch (error) {
            logger.error("Error updating profile", { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }
}

export default adminController;

import User from "../models/User.js";
import Profile from "../models/Profile.js";
import logger from "../utils/logger.js";
import { supabase } from "../supabase.js";

class ProfileController {
    static async updateUsername(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const { username } = req.body;

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            const oldUsername = await Profile.getUsername(user.id);

            const profile = await Profile.updateUsername(user.id, username);

            logger.info("Username updated", {
                userId: user.id,
                oldUsername,
                newUsername: username
            });

            res.json({ profile });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async uploadAvatar(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const file = req.file;

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const filePath = `avatars/${user.id}-${Date.now()}.png`;

            const { error: uploadError } = await supabase.storage
                .from("profile_pics_bucket")
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (uploadError) {
                throw new Error(uploadError.message);
            }

            const { data: urlData } = supabase.storage
                .from("profile_pics_bucket")
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;

            const profile = await Profile.updateAvatar(user.id, publicUrl);

            logger.info("Avatar uploaded", {
                userId: user.id,
                filePath,
                fileSize: file.size
            });

            res.json({ profile });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default ProfileController;

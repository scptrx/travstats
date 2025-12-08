import User from "../models/User.js";
import Profile from "../models/Profile.js";
import logger from "../utils/logger.js";

class AuthController {
    static async register(req, res) {
        try {
            const { email, password, username } = req.body;

            const user = await User.register(email, password, username);

            logger.info("User registered", {
                userId: user.id,
                email: user.email
            });

            res.json({ user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const { user, session } = await User.login(email, password);

            const profile = await Profile.getOrCreate(
                user.id,
                user.email,
                user.user_metadata?.username
            );

            logger.info("User logged in", {
                userId: user.id,
                email: user.email
            });

            res.json({ user, session, profile });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async check(req, res) {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "");

            if (!token) {
                return res.status(401).json({ error: "No token" });
            }

            const user = await User.getUserByToken(token);

            const profile = await Profile.getOrCreate(
                user.id,
                user.email,
                user.user_metadata?.username
            );

            logger.info("User checked", {
                userId: user.id,
                email: user.email
            });

            res.json({ user, profile });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
export default AuthController;

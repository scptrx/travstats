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
            const profile = await Profile.getOrCreate(user.id, user.email, user.user_metadata?.username);

            const isRestricted = await Profile.isRestricted(user.id);
            if (isRestricted) {
                const restrictedDate = new Date(profile.restricted_until).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

                logger.warn("Restricted user attempted login", {
                    userId: user.id,
                    email: user.email,
                    restrictedUntil: profile.restricted_until
                });

                return res.status(403).json({
                    error: `Your account has been restricted until ${restrictedDate}.`
                });
            }

            logger.info("User logged in", {
                userId: user.id,
                email: user.email,
                role: profile.role
            });

            res.cookie("auth_token", session.access_token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });

            if (profile.role === "admin") {
                return res.json({
                    user,
                    session,
                    profile,
                    isAdmin: true,
                    redirectTo: `http://localhost:${process.env.PORT}/admin/dashboard?token=${session.access_token}`
                });
            }

            res.json({
                user,
                session,
                profile,
                isAdmin: false
            });
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
            const profile = await Profile.getOrCreate(user.id, user.email, user.user_metadata?.username);

            const isRestricted = await Profile.isRestricted(user.id);
            if (isRestricted) {
                const restrictedDate = new Date(profile.restricted_until).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

                logger.warn("Restricted user session detected", {
                    userId: user.id,
                    email: user.email,
                    restrictedUntil: profile.restricted_until
                });

                return res.status(403).json({
                    error: `Your account has been restricted until ${restrictedDate}.`,
                    restricted: true
                });
            }

            logger.info("User checked", {
                userId: user.id,
                email: user.email,
                role: profile.role
            });

            res.json({
                user,
                profile,
                isAdmin: profile.role === "admin"
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
export default AuthController;

import User from "../models/User.js";
import Profile from "../models/Profile.js";

export async function adminAuth(req, res, next) {
    try {
        const token = req.query.token || req.cookies?.auth_token || req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }

        if (req.query.token) {
            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });
        }

        const user = await User.getUserByToken(token);
        const profile = await Profile.getById(user.id);

        if (profile.role !== "admin") {
            return res.status(403).send("Access denied.");
        }

        req.user = user;
        req.profile = profile;
        next();
    } catch (error) {
        res.status(401).send(`Unauthorized: ${error.message}`);
    }
}

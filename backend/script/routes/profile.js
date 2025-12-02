import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

// POST /profile/update-profile
router.post("/update-profile", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { username, avatar_url } = req.body;
    
    const { data, error } = await supabase.auth.updateUser(
        { data: { username, avatar_url } },
        { accessToken: token }
    );
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.json({ user: data.user });
});

export default router;

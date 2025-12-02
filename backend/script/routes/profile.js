import express from "express";
import { supabase } from "../supabase.js";
const router = express.Router();

// PUT /profile/update - обновление профиля
router.put("/update", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { username, profile_picture_url } = req.body;
    
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
        return res.status(401).json({ error: authError.message });
    }
    
    const { data, error } = await supabase
        .from('profiles')
        .update({ 
            username, 
            profile_picture_url 
        })
        .eq('id', user.id)
        .select()
        .single();
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json({ profile: data });
});

export default router;
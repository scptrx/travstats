import express from "express";
import { supabase } from "../supabase.js";
const router = express.Router();

async function getOrCreateProfile(userId, userEmail, username = null) {
    let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error || !profile) {
        const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                username: username || userEmail.split('@')[0],
                email: userEmail,
                profile_picture_url: null
            })
            .select()
            .single();
        
        profile = newProfile;
    }
    
    return profile;
}

// POST /auth/register
router.post("/register", async (req, res) => {
    const { email, password, username } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json({ 
        user: data.user 
    });
});

// POST /auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    const profile = await getOrCreateProfile(
        data.user.id, 
        data.user.email,
        data.user.user_metadata?.username
    );
    
    res.json({ 
        user: data.user,
        session: data.session,
        profile
    });
});

// GET /auth/check
router.get("/check", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
        return res.status(401).json({ error: error.message });
    }
    
    const profile = await getOrCreateProfile(
        user.id, 
        user.email,
        user.user_metadata?.username
    );
    
    res.json({ user, profile });
});

export default router;
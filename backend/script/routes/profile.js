import { supabase } from "../supabase.js";
import express from "express";
import logger from "../utils/logger.js";
const router = express.Router();

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

// PUT /profile/update-username 
router.put("/update-username", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { username } = req.body;
    let oldUsername = null;

    if (token) {
        const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
        if (!authErr && user) {
            const { data: profile, error: profileErr } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();

            if (!profileErr && profile) {
                oldUsername = profile.username;
            }
        }
    }
    
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
            username
        })
        .eq('id', user.id)
        .select()
        .single();
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }

    logger.info("Username updated", { 
        userId: user.id, 
        oldUsername, 
        newUsername: username 
    });
    
    res.json({ profile: data });
});

// POST /profile/upload-avatar
router.post("/upload-avatar", upload.single("file"), async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const file = req.file;

    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
        return res.status(401).json({ error: authError.message });
    }
    
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
        return res.status(400).json({ error: uploadError.message });
    }
    
    const { data: urlData } = supabase.storage
        .from("profile_pics_bucket")
        .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    
    const { data, error } = await supabase
        .from("profiles")
        .update({ profile_picture_url: publicUrl })
        .eq("id", user.id)
        .select()
        .single();
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    logger.info("Avatar uploaded", { 
        userId: user.id, 
        filePath,
        fileSize: file.size 
    });

    res.json({ profile: data });
});

export default router;
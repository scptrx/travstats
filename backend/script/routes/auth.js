import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ 
    user: data.user,
    session: data.session
  });
});

// POST /auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ user: data.user });
});

// GET /auth/check
router.get("/check", async (req, res) => {
    const token = req.headers.authorization?.replace("Token ", "");
    
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
        return res.status(401).json({ error: error.message });
    }
    
    res.json({ user });
});

export default router;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
  
  console.log("Supabase client initialized:", supabase);
  console.log("Supabase URL:", process.env.SUPABASE_URL ? "Loaded" : "Not Loaded");
  console.log("Supabase Anon Key:", process.env.SUPABASE_ANON_PUBLIC_KEY ? "Loaded" : "Not Loaded" );
});


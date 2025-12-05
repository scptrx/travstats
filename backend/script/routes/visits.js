import express from "express";
import { supabase } from "../supabase.js";
import logger from "../utils/logger.js";

const router = express.Router();

async function getOrCreateCountry(isoCode, countryData) {

    let { data: country, error } = await supabase
        .from('countries')
        .select('id')
        .eq('iso_code', isoCode)
        .single();
    
    if (error || !country) {
        const { data: newCountry, error: insertError } = await supabase
            .from('countries')
            .insert({
                iso_code: isoCode,
                name: countryData.name,
                region: countryData.region || null,
                latitude: countryData.latitude || null,
                longitude: countryData.longitude || null
            })
            .select()
            .single();
        
        if (insertError) {
            logger.error("Failed to create country", { error: insertError.message, isoCode });
            throw new Error(`Failed to create country: ${insertError.message}`);
        }
        
        logger.info("Country created", { isoCode, name: countryData.name });
        country = newCountry;
    }
    
    return country;
}

// POST /visits/add-country 
router.post("/add-country", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { 
        country_iso_code, 
        country_name,
        country_region,
        country_latitude,
        country_longitude,
        visit_date, 
        notes 
    } = req.body;
    
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
        return res.status(401).json({ error: authError.message });
    }
    
    let country;
    try {
        country = await getOrCreateCountry(country_iso_code, {
            name: country_name,
            region: country_region,
            latitude: country_latitude,
            longitude: country_longitude
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    

    const { data: existingVisit } = await supabase
        .from('visits')
        .select('id')
        .eq('user_id', user.id)
        .eq('country_id', country.id)
        .is('subdivision_id', null)
        .is('city_id', null)
        .single();
    
    if (existingVisit) {
        return res.status(409).json({ 
            error: "Country already visited",
            visit_id: existingVisit.id 
        });
    }
    
    const { data: visit, error: insertError } = await supabase
        .from('visits')
        .insert({
            user_id: user.id,
            country_id: country.id,
            visit_date: visit_date || new Date().toISOString().split('T')[0],
            notes: notes || null
        })
        .select()
        .single();
    
    if (insertError) {
        logger.error("Failed to add visit", { error: insertError.message, user_id: user.id });
        return res.status(400).json({ error: insertError.message });
    }
    
    logger.info("Country visit added", { 
        user_id: user.id, 
        country_iso: country_iso_code,
        country_name: country_name
    });
    
    res.json({ visit });
});

// DELETE /visits/:id 
router.delete("/:id", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { id } = req.params;
    
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
        return res.status(401).json({ error: authError.message });
    }
    
    const { error: deleteError } = await supabase
        .from('visits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    
    if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
    }
    
    logger.info("Visit deleted", { user_id: user.id, visit_id: id });
    
    res.json({ message: "Visit deleted" });
});

// GET /visits/my 
router.get("/my", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
        return res.status(401).json({ error: authError.message });
    }
    
    const { data: visits, error } = await supabase
        .from('visits')
        .select(`
            *,
            countries (
                id,
                iso_code,
                name,
                region,
                latitude,
                longitude
            ),
            subdivisions (
                id,
                code,
                name
            ),
            cities (
                id,
                name
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json({ visits });
});

export default router;
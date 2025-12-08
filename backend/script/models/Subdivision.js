import { supabase } from "../supabase.js";
import logger from "../utils/logger.js";

class Subdivision {
    static async getOrCreate(isoCode, subdivisionData) {
        let { data: subdivision, error } = await supabase
            .from("subdivisions")
            .select("id")
            .eq("code", isoCode)
            .single();

        if (error || !subdivision) {
            const { data: newSubdivision, error: insertError } = await supabase
                .from("subdivisions")
                .insert({
                    code: isoCode,
                    name: subdivisionData.name,
                    country_id: subdivisionData.country_id,
                    latitude: subdivisionData.latitude || null,
                    longitude: subdivisionData.longitude || null,
                    type: subdivisionData.type || null
                })
                .select()
                .single();

            if (insertError) {
                logger.error("Failed to create subdivision", {
                    error: insertError.message,
                    isoCode
                });
                throw new Error(`Failed to create subdivision: ${insertError.message}`);
            }

            logger.info("Subdivision created", {
                isoCode,
                name: subdivisionData.name
            });

            subdivision = newSubdivision;
        }

        return subdivision;
    }

    static async getByIsoCode(isoCode) {
        const { data, error } = await supabase
            .from("subdivisions")
            .select("*")
            .eq("code", isoCode)
            .single();

        if (error) {
            return null;
        }

        return data;
    }

    static async getByCountryIso(countryIso) {
        const country = await supabase
            .from("countries")
            .select("id")
            .eq("iso_code", countryIso)
            .single();

        if (!country.data) {
            throw new Error(`Country with ISO code ${countryIso} not found`);
        }

        const countryId = country.data.id;

        const { data, error } = await supabase
            .from("subdivisions")
            .select("*")
            .eq("country_id", countryId);
        if (error) {
            throw new Error(`Failed to fetch subdivisions: ${error.message}`);
        }

        return data;
    }

    static async getAll() {
        const { data, error } = await supabase.from("subdivisions").select("*");

        if (error) {
            throw new Error(`Failed to fetch subdivisions: ${error.message}`);
        }

        return data;
    }
}
export default Subdivision;

import { supabase } from "../supabase.js";
import logger from "../utils/logger.js";

class Country {
    static async getOrCreate(isoCode, countryData) {
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
                logger.error("Failed to create country", { 
                    error: insertError.message, 
                    isoCode 
                });
                throw new Error(`Failed to create country: ${insertError.message}`);
            }
            
            logger.info("Country created", { 
                isoCode, 
                name: countryData.name 
            });
            
            country = newCountry;
        }
        
        return country;
    }

    static async getByIsoCode(isoCode) {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .eq('iso_code', isoCode)
            .single();

        if (error) {
            return null;
        }

        return data;
    }

    static async getAll() {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .order('name');

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

export default Country;
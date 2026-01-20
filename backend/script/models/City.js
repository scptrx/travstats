import { supabase } from "../supabase.js";

class City {
    static async getOrCreate(name, cityData) {
        let { data: city, error } = await supabase
            .from("cities")
            .select("id")
            .eq("name", name)
            .eq("latitude", cityData.latitude || null)
            .eq("longitude", cityData.longitude || null)
            .single();

        if (error || !city) {
            const { data: newCity, error: insertError } = await supabase
                .from("cities")
                .insert({
                    name: name,
                    subdivision_id: cityData.subdivision_id,
                    country_id: cityData.country_id,
                    latitude: cityData.latitude || null,
                    longitude: cityData.longitude || null
                })
                .select()
                .single();

            if (insertError) {
                throw new Error(`Failed to create city: ${insertError.message}`);
            }

            city = newCity;
        }

        return city;
    }
}
export default City;

import { supabase } from "../supabase.js";

class Visit {
    static async create(userId, countryId, visitDate, notes, subdivisionId = null, cityId = null) {
        const { data, error } = await supabase
            .from("visits")
            .insert({
                user_id: userId,
                country_id: countryId,
                subdivision_id: subdivisionId,
                city_id: cityId,
                visit_date: visitDate || new Date().toISOString().split("T")[0],
                notes: notes || null
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async update(visitId, userId, { visit_date, notes }) {
        const { data, error } = await supabase
            .from("visits")
            .update({
                visit_date,
                notes
            })
            .eq("id", visitId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async checkExists(userId, countryId, subdivisionId = null, cityId = null) {
        let query = supabase.from("visits").select("id").eq("user_id", userId);

        if (subdivisionId) {
            query = query.eq("subdivision_id", subdivisionId);
        } else if (countryId) {
            query = query.eq("country_id", countryId).is("subdivision_id", null).is("city_id", null);
        }

        const { data } = await query.single();
        return data;
    }

    static async delete(visitId, userId) {
        const { error } = await supabase.from("visits").delete().eq("id", visitId).eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    static async getUserVisits(userId) {
        const { data, error } = await supabase
            .from("visits")
            .select(
                `
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
                    name,
                    type
                ),
                cities (
                    id,
                    name
                )
            `
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getUserSubdivisionVisitsByCountry(userId, countryId) {
        const { data, error } = await supabase
            .from("visits")
            .select(
                `
                *,
                subdivisions (
                    id,
                    code,
                    name,
                    type,
                    country_id
                )
            `
            )
            .eq("user_id", userId)
            .eq("subdivisions.country_id", countryId)
            .not("subdivision_id", "is", null);

        if (error) {
            return { data: null, error };
        }

        return { data, error: null };
    }
}
export default Visit;

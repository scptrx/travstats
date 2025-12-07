import { supabase } from "../supabase.js";

class Visit {
    /**
     * Создать визит страны
     */
    static async create(userId, countryId, visitDate, notes) {
        const { data, error } = await supabase
            .from('visits')
            .insert({
                user_id: userId,
                country_id: countryId,
                visit_date: visitDate || new Date().toISOString().split('T')[0],
                notes: notes || null
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Проверить существование визита
     */
    static async checkExists(userId, countryId) {
        const { data } = await supabase
            .from('visits')
            .select('id')
            .eq('user_id', userId)
            .eq('country_id', countryId)
            .is('subdivision_id', null)
            .is('city_id', null)
            .single();

        return data;
    }

    /**
     * Удалить визит
     */
    static async delete(visitId, userId) {
        const { error } = await supabase
            .from('visits')
            .delete()
            .eq('id', visitId)
            .eq('user_id', userId);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    /**
     * Получить все визиты пользователя
     */
    static async getUserVisits(userId) {
        const { data, error } = await supabase
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
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

export default Visit;
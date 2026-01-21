import { supabase } from "../supabase.js";

class Profile {
    static async getOrCreate(userId, userEmail, username = null) {
        let { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error || !profile) {
            const { data: newProfile } = await supabase
                .from("profiles")
                .insert({
                    id: userId,
                    username: username || userEmail.split("@")[0],
                    email: userEmail,
                    profile_picture_url: null
                })
                .select()
                .single();

            profile = newProfile;
        }

        return profile;
    }

    static async updateUsername(userId, username) {
        const { data, error } = await supabase
            .from("profiles")
            .update({ username })
            .eq("id", userId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async updateAvatar(userId, avatarUrl) {
        const { data, error } = await supabase
            .from("profiles")
            .update({ profile_picture_url: avatarUrl })
            .eq("id", userId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getById(userId) {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getUsername(userId) {
        const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId)
            .single();

        if (error || !data) {
            return null;
        }

        return data.username;
    }
}
export default Profile;

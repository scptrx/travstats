import { supabase } from "../supabase.js";

class Profile {
    static async getOrCreate(userId, userEmail, username = null) {
        let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

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
        const { data, error } = await supabase.from("profiles").update({ username }).eq("id", userId).select().single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async updateAvatar(userId, avatarUrl) {
        const { data, error } = await supabase.from("profiles").update({ profile_picture_url: avatarUrl }).eq("id", userId).select().single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getById(userId) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getUsername(userId) {
        const { data, error } = await supabase.from("profiles").select("username").eq("id", userId).single();

        if (error || !data) {
            return null;
        }

        return data.username;
    }

    static async isAdmin(userId) {
        const profile = await this.getByUserId(userId);
        return profile?.role === "admin";
    }

    static async getAll() {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    static async updateByAdmin(userId, updates) {
        const updateData = {};

        if (updates.username !== undefined) {
            updateData.username = updates.username;
        }
        if (updates.role !== undefined) {
            updateData.role = updates.role;
        }
        if (updates.restricted_until !== undefined) {
            updateData.restricted_until = updates.restricted_until;
        }

        const { data, error } = await supabase.from("profiles").update(updateData).eq("id", userId).select().single();

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    static async isRestricted(userId) {
        const profile = await this.getById(userId);

        if (!profile.restricted_until) {
            return false;
        }

        const restrictedDate = new Date(profile.restricted_until);
        const now = new Date();

        return restrictedDate > now;
    }
}
export default Profile;

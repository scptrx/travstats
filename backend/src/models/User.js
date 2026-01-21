import { supabase } from "../supabase.js";

class User {
    static async getUserByToken(token) {
        const {
            data: { user },
            error
        } = await supabase.auth.getUser(token);

        if (error) {
            throw new Error(error.message);
        }

        return user;
    }

    static async register(email, password, username) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        return data.user;
    }

    static async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        return { user: data.user, session: data.session };
    }
}
export default User;

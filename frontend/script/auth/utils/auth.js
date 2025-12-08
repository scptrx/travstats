const API_URL = "http://localhost:3000";

// token confirmation and redirect to profile if AUTHENTICATED (for sign-in/sign-up pages)
export async function checkAuthAndRedirect(redirectUrl = "profile.html") {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/auth/check`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            window.location.href = redirectUrl;
            return true;
        } else {
            clearAuth();
            return false;
        }
    } catch (err) {
        console.error("Token check error:", err);
        return false;
    }
}

// Require authentication and redirect to sign-in if NOT AUTHENTICATED (for protected pages)
export async function requireAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "sign-in.html";
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/auth/check`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            clearAuth();
            window.location.href = "sign-in.html";
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Auth check failed:", error);
        clearAuth();
        window.location.href = "sign-in.html";
        return null;
    }
}

export async function validateToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/auth/check`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            clearAuth();
            window.location.reload();
            return false;
        }

        return true;
    } catch (err) {
        console.error("Token validation error:", err);
        clearAuth();
        return false;
    }
}

export function saveAuth(session, user) {
    localStorage.setItem("accessToken", session.access_token);
    localStorage.setItem("refreshToken", session.refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
}

export function getToken() {
    return localStorage.getItem("accessToken");
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    return { res, data };
}

export async function register(email, password, username) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username })
    });

    const data = await res.json();
    return { res, data };
}

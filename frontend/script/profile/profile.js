async function checkAuth() {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
        window.location.href = "sign-in.html";
        return null;
    }

    try {
        const res = await fetch("http://localhost:3000/auth/check", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            localStorage.clear();
            window.location.href = "sign-in.html";
            return null;
        }
        const data = await res.json();
        return data.user;

    } catch (error) {
        window.location.href = "sign-in.html";
        return null;
    }
}

async function displayUserProfile() {
    const user = await checkAuth();
    if (!user) return;
    
    const profileInfo = document.querySelector(".profile-info");
    
    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    profileInfo.innerHTML = `
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Username:</strong> ${user.user_metadata.username}</p>
        <p><strong>Member Since:</strong> ${memberSince}</p>
        <button id="change-password-button">Change Password</button>
        <button id="sign-out-button">Sign Out</button>
    `;
    
    document.getElementById("sign-out-button").addEventListener("click", signOut);
}

function signOut() {
    localStorage.clear();
    window.location.href = "sign-in.html";
}

document.addEventListener("DOMContentLoaded", displayUserProfile);
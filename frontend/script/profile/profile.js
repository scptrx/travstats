

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
        return data;
    } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.clear();
        window.location.href = "sign-in.html";
        return null;
    }
}

async function displayUserProfile() {
    const profileInfo = document.querySelector(".profile-info");
    profileInfo.innerHTML = '<p>Loading...</p>';
    
    const response = await checkAuth();
    if (!response) return;
    
    const { user, profile } = response; 
    
    if (!profile) {
        profileInfo.innerHTML = '<p>Error loading profile. Please refresh the page.</p>';
        return;
    }
    
    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    profileInfo.innerHTML = `
        <img src="${profile.profile_picture_url || '/frontend/assets/img/profile-picture.jpg'}" 
             alt="Avatar" class="avatar" style="width: 100px; height: 100px; border-radius: 50%;">
        <p><strong>Username:</strong> ${profile.username}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Member Since:</strong> ${memberSince}</p>
        <input type="file" id="profile-pic-input" accept="image/*">
        <button id="change-profile-pic-button">Upload Profile Picture</button>
        <button id="change-password-button">Change Password</button>
        <button id="sign-out-button">Sign Out</button>
    `;

    const token = localStorage.getItem("accessToken");

    document.getElementById("change-profile-pic-button").addEventListener("click", () => changeProfilePic(token));
    // document.getElementById("change-password-button").addEventListener("click", changePassword);
    document.getElementById("sign-out-button").addEventListener("click", signOut);
}


async function changeProfilePic(token) {
    const fileInput = document.querySelector("#profile-pic-input");
    const file = fileInput.files[0];

    const form = new FormData();
    form.append("file", file);

    await fetch("http://localhost:3000/profile/upload-avatar", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`
    },
    body: form
    });
    displayUserProfile();
}   


// async function changePassword() {
// }


function signOut() {
    localStorage.clear();
    window.location.href = "sign-in.html";
}


document.addEventListener("DOMContentLoaded", displayUserProfile);
const API_URL = "http://localhost:3000";

import { loadVisitedCountries } from "../map/visitManager.js";
import { requireAuth } from "../auth/utils/auth.js";

async function displayUserProfile() {
    const profileInfo = document.querySelector(".profile-info");
    profileInfo.innerHTML = "<p>Loading...</p>";

    const response = await requireAuth();
    if (!response) {
        profileInfo.innerHTML = "<p>Not authenticated. Redirecting...</p>";
        return;
    }

    const { user, profile } = response;

    if (!user) {
        profileInfo.innerHTML = "<p>Error loading profile. Please refresh the page.</p>";
        return;
    }

    const memberSince = user.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
          })
        : "Unknown";

    profileInfo.innerHTML = `
        <img src="${profile.profile_picture_url || "/frontend/assets/img/profile-picture.jpg"}" 
             alt="Avatar" class="avatar" style="width: 100px; height: 100px; border-radius: 50%;">
        <p><strong>Username:</strong> ${profile.username}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Member Since:</strong> ${memberSince}</p>
        <input type="file" id="profile-pic-input" accept="image/*">
        <button id="change-profile-pic-button">Upload Profile Picture</button>
        <button id="change-username-button">Change Username</button>
        <button id="change-password-button">Change Password</button>
        <button id="sign-out-button">Sign Out</button>
    `;

    const token = localStorage.getItem("accessToken");

    document.getElementById("change-profile-pic-button").addEventListener("click", async () => await changeProfilePic(token));

    // document.getElementById("change-password-button")
    //     .addEventListener("click", changePassword);

    // document.getElementById("change-username-button")
    //     .addEventListener("click", changeUsername);

    document.getElementById("sign-out-button").addEventListener("click", signOut);
}

async function changeProfilePic(token) {
    const fileInput = document.querySelector("#profile-pic-input");
    const file = fileInput.files[0];

    const form = new FormData();
    form.append("file", file);

    await fetch(`${API_URL}/profile/upload-avatar`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: form
    });
    displayUserProfile();
}

// async function changeUsername() {
//     const newUsername = prompt("Enter your new username:");
//     if (!newUsername) return;
// }

// async function changePassword() {
// }

function signOut() {
    localStorage.clear();
    window.location.href = "sign-in.html";
}

loadVisitedCountries().then((visits) => {
    const countriesCountElem = document.getElementById("countries-count");
    countriesCountElem.textContent = visits.length;
});

document.addEventListener("DOMContentLoaded", displayUserProfile);

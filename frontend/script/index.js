import "./map/core/mapConfig.js";
import "./map/search/citySearch.js";
import "./map/layers/countryLayer.js";
import "./map/layers/subdivisionLayer.js";
import "./map/layers/cityLayer.js";

import { validateToken } from "./auth/utils/auth.js";

async function checkUserStatus() {
    await validateToken();
    const token = localStorage.getItem("accessToken");
    const signInDiv = document.getElementById("sign-in");

    if (token) {
        signInDiv.innerHTML = `
            <button id="user-profile-button" type="button" onclick="window.location.href='pages/profile.html'">My Profile</button>
        `;
    } else {
        return;
    }
}

document.addEventListener("DOMContentLoaded", checkUserStatus);

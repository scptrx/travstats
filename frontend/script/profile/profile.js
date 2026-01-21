import { API_URL } from "../config/api.js";
import { loadVisitedCountries } from "../map/visits/countryVisitManager.js";
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

    renderProfileInfo(user, profile);
    attachEventListeners();
}

function renderProfileInfo(user, profile) {
    const profileInfo = document.querySelector(".profile-info");
    const memberSince = formatMemberSinceDate(user.created_at);
    const avatarUrl = profile.profile_picture_url || "/frontend/assets/img/profile-picture.jpg";

    profileInfo.innerHTML = `
        <img src="${avatarUrl}" alt="Avatar" class="avatar">
        <p><strong>Username:</strong> ${profile.username}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Member Since:</strong> ${memberSince}</p>
        
        <div class="profile-pic-upload">
            <input type="file" id="profile-pic-input" accept="image/*">
            <button id="change-profile-pic-button">Upload Profile Picture</button>
        </div>
        
        <button id="sign-out-button">Sign Out</button>
    `;
}

function formatMemberSinceDate(createdAt) {
    if (!createdAt) return "Unknown";

    return new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function attachEventListeners() {
    const token = localStorage.getItem("accessToken");

    document.getElementById("change-profile-pic-button").addEventListener("click", () => changeProfilePic(token));

    document.getElementById("sign-out-button").addEventListener("click", signOut);
}

async function changeProfilePic(token) {
    const fileInput = document.querySelector("#profile-pic-input");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        await fetch(`${API_URL}/profile/upload-avatar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        await displayUserProfile();
    } catch (error) {
        console.error("Failed to upload profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
    }
}

function signOut() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "sign-in.html";
}

async function loadAndRenderTravelStats() {
    try {
        const token = localStorage.getItem("accessToken");

        const countryVisits = await loadVisitedCountries();
        const countriesCountElem = document.getElementById("countries-count");
        const totalCountries = 234;

        if (countriesCountElem) {
            countriesCountElem.textContent = `${countryVisits.length} / ${totalCountries}`;
        }

        const response = await fetch(`${API_URL}/visits/my-cities`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.visits || data.visits.length === 0) {
            return;
        }

        const stats = calculateExtremePoints(data.visits);
        renderCityStats(stats);
    } catch (error) {
        console.error("Failed to load travel stats:", error);
    }
}

function calculateExtremePoints(visits) {
    const visitsWithCoords = visits.filter((visit) => visit.cities && visit.cities.latitude !== null && visit.cities.longitude !== null);

    if (visitsWithCoords.length === 0) {
        return null;
    }

    return {
        northernmost: visitsWithCoords.reduce((max, visit) => (visit.cities.latitude > max.cities.latitude ? visit : max)),
        southernmost: visitsWithCoords.reduce((min, visit) => (visit.cities.latitude < min.cities.latitude ? visit : min)),
        easternmost: visitsWithCoords.reduce((max, visit) => (visit.cities.longitude > max.cities.longitude ? visit : max)),
        westernmost: visitsWithCoords.reduce((min, visit) => (visit.cities.longitude < min.cities.longitude ? visit : min)),
        totalCities: visits.length
    };
}

function renderCityStats(stats) {
    const citiesCountElem = document.getElementById("cities-count");

    if (citiesCountElem) {
        citiesCountElem.textContent = stats.totalCities;
    }

    if (!stats.northernmost) return;

    const northernmostElem = document.getElementById("northernmost-city");
    const southernmostElem = document.getElementById("southernmost-city");
    const easternmostElem = document.getElementById("easternmost-city");
    const westernmostElem = document.getElementById("westernmost-city");

    if (northernmostElem) {
        northernmostElem.textContent = `${stats.northernmost.cities.name}`;
    }
    if (southernmostElem) {
        southernmostElem.textContent = `${stats.southernmost.cities.name}`;
    }
    if (easternmostElem) {
        easternmostElem.textContent = `${stats.easternmost.cities.name}`;
    }
    if (westernmostElem) {
        westernmostElem.textContent = `${stats.westernmost.cities.name}`;
    }
}

async function initializeProfile() {
    await displayUserProfile();
    await loadAndRenderTravelStats();
}

document.addEventListener("DOMContentLoaded", initializeProfile);

import { API_URL } from "../../config/api.js";

export async function addSubdivisionVisit(subdivisionData, visitDate) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in to save your travels!");
        window.location.href = "pages/sign-in.html";
        return null;
    }

    try {
        const payload = {
            subdivision_code: subdivisionData.code,
            subdivision_name: subdivisionData.name,
            country_iso_code: subdivisionData.countryCode,
            subdivision_latitude: subdivisionData.latitude,
            subdivision_longitude: subdivisionData.longitude,
            type: subdivisionData.type,
            visit_date: visitDate || new Date().toISOString().split("T")[0],
            notes: `Visited ${subdivisionData.name}`
        };

        const res = await fetch(`${API_URL}/visits/add-subdivision`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            console.log("Subdivision added:", subdivisionData.name);
            return data.visit;
        } else if (res.status === 409) {
            console.log("Already visited:", subdivisionData.name);
            alert(`${subdivisionData.name} is already in your visited list!`);
            return null;
        } else {
            console.error("Error:", data.error);
            alert(`Failed to add ${subdivisionData.name}: ${data.error}`);
            return null;
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to server");
        return null;
    }
}

export async function loadVisitedSubdivisions(countryIsoCode) {
    const token = localStorage.getItem("accessToken");
    if (!token) return [];

    try {
        const res = await fetch(`${API_URL}/visits/my-subdivisions/${countryIsoCode}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            const data = await res.json();
            return data.visits;
        }
        return [];
    } catch (error) {
        console.error("Failed to load visited subdivisions:", error);
        return [];
    }
}

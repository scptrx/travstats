import { API_URL } from "../../config/api.js";

export async function addCountryVisit(countryIsoCode, countryData, visitDate) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in to save your travels!");
        window.location.href = "pages/sign-in.html";
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/visits/add-country`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                country_iso_code: countryIsoCode,
                country_name: countryData.name,
                country_region: countryData.region,
                visit_date: visitDate || new Date().toISOString().split("T")[0],
                notes: `Visited ${countryData.name}`
            })
        });

        const data = await res.json();

        if (res.ok) {
            return data.visit;
        } else if (res.status === 409) {
            return null;
        } else {
            alert(`Failed to add ${countryData.name}: ${data.error}`);
            return null;
        }
    } catch (error) {
        alert("Failed to connect to server");
        return null;
    }
}

export async function loadVisitedCountries() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return [];
    }

    try {
        const res = await fetch(`${API_URL}/visits/my-countries`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            return data.visits || [];
        } else {
            console.error("Failed to load visits:", data.error);
            return [];
        }
    } catch (error) {
        console.error("Failed to load visits:", error);
        return [];
    }
}

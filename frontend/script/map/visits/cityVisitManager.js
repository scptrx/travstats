import { API_URL } from "../../api.js";

export async function addCityVisit(cityData, visitDate) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in to save your travels!");
        window.location.href = "pages/sign-in.html";
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/visits/add-city`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                city_name: cityData.name,
                country_name: cityData.country,
                city_latitude: cityData.latitude,
                city_longitude: cityData.longitude,
                visit_date: visitDate,
                notes: `Visited ${cityData.name}`
            })
        });

        const data = await res.json();

        if (res.ok) {
            console.log("City added:", cityData.name);
            return data.visit;
        } else if (res.status === 409) {
            console.log("Already visited:", cityData.name);
            return null;
        } else {
            console.error("Error:", data.error);
            alert(`Failed to add ${cityData.name}: ${data.error}`);
            return null;
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to server");
        return null;
    }
}

export async function loadVisitedCities() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return [];
    }

    try {
        const res = await fetch(`${API_URL}/visits/my-cities`, {
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

const API_URL = "http://localhost:3000";

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
            console.log("Country added:", countryData.name);
            return data.visit;
        } else if (res.status === 409) {
            console.log("Already visited:", countryData.name);
            return null;
        } else {
            console.error("Error:", data.error);
            alert(`Failed to add ${countryData.name}: ${data.error}`);
            return null;
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to server");
        return null;
    }
}

export async function updateCountryVisit(visitId, visitDate) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in!");
        return false;
    }

    try {
        const res = await fetch(`${API_URL}/visits/${visitId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                visit_date: visitDate
            })
        });

        const data = await res.json();

        if (res.ok) {
            console.log("Visit updated");
            return true;
        } else {
            console.error("Error:", data.error);
            alert(`Failed to update visit: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to server");
        return false;
    }
}

export async function deleteCountryVisit(visitId) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in!");
        return false;
    }

    try {
        const res = await fetch(`${API_URL}/visits/${visitId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            console.log("Visit deleted");
            return true;
        } else {
            const data = await res.json();
            console.error("Error:", data.error);
            alert(`Failed to delete visit: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to server");
        return false;
    }
}

export async function loadVisitedCountries() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return [];
    }

    try {
        const res = await fetch(`${API_URL}/visits/my`, {
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

export async function addSubdivisionVisit(subdivisionData, visitDate) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in to save your travels!");
        window.location.href = "pages/sign-in.html";
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/visits/add-subdivision`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                subdivision_code: subdivisionData.code,
                subdivision_name: subdivisionData.name,
                country_iso_code: subdivisionData.countryCode,
                subdivision_latitude: subdivisionData.latitude,
                subdivision_longitude: subdivisionData.longitude,
                type: subdivisionData.type,
                visit_date: visitDate || new Date().toISOString().split("T")[0],
                notes: `Visited ${subdivisionData.name}`
            })
        });

        // stringed json
        console.log(
            "Request body:",
            JSON.stringify({
                subdivision_code: subdivisionData.code,
                subdivision_name: subdivisionData.name,
                country_iso_code: subdivisionData.countryCode,
                subdivision_latitude: subdivisionData.latitude,
                subdivision_longitude: subdivisionData.longitude,
                type: subdivisionData.type,
                visit_date: visitDate || new Date().toISOString().split("T")[0],
                notes: `Visited ${subdivisionData.name}`
            })
        );

        const data = await res.json();

        if (res.ok) {
            console.log("Subdivision added:", subdivisionData.name);
            return data.visit;
        } else if (res.status === 409) {
            console.log("Already visited:", subdivisionData.name);
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

export async function updateSubdivisionVisit(visitId, visitDate) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in!");
        return false;
    }

    try {
        const res = await fetch(`${API_URL}/visits/subdivision/${visitId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                visit_date: visitDate
            })
        });

        const data = await res.json();

        if (res.ok) {
            console.log("Subdivision visit updated");
            return true;
        } else {
            console.error("Error:", data.error);
            alert(`Failed to update visit: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to server");
        return false;
    }
}

export async function deleteSubdivisionVisit(visitId) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Please sign in!");
        return false;
    }

    try {
        const res = await fetch(`${API_URL}/visits/my/${visitId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            console.log("Subdivision visit deleted");
            return true;
        } else {
            const data = await res.json();
            console.error("Error:", data.error);
            alert(`Failed to delete visit: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to server");
        return false;
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

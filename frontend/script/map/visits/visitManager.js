import { API_URL } from "../../api.js";

export async function updateVisit(visitId, visitDate) {
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

export async function deleteVisit(visitId) {
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

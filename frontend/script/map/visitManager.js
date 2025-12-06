
export async function addCountryVisit(countryIsoCode, countryData) {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
        alert("Please sign in to save your travels!");
        window.location.href = "pages/sign-in.html";
        return null;
    }
    
    try {
        const res = await fetch("http://localhost:3000/visits/add-country", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                country_iso_code: countryIsoCode,
                country_name: countryData.name,           
                country_region: countryData.region,       
                visit_date: new Date().toISOString().split('T')[0],
                notes: `Visited ${countryData.name}`
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            console.log("Country added:", countryData.name);
            return data.visit;
        } else if (res.status === 409) {
            console.log("Already visited:", countryData.name);
            alert(`You've already marked ${countryData.name} as visited!`);
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

export async function loadVisitedCountries() {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
        return [];
    }
    
    try {
        const res = await fetch("http://localhost:3000/visits/my", {
            headers: {
                "Authorization": `Bearer ${token}`
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

// окей, бро, а как сделать так чтобы вместо окна алерты показывались на самом сайте?


// export async function addCountryVisit(countryIsoCode, countryData) {
//     const token = localStorage.getItem("accessToken");
    
//     if (!token) {
//         alert("Please sign in to save your travels!");
//         window.location.href = "pages/sign-in.html";
//         return null;
//     }
    
//     try {
//         const res = await fetch("http://localhost:3000/visits/add-country", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 country_iso_code: countryIsoCode,
//                 country_name: countryData.name,           
//                 country_region: countryData.region,       
//                 visit_date: new Date().toISOString().split('T')[0],
//                 notes: `Visited ${countryData.name}`
//             })
//         });
        
//         const data = await res.json();
        
//         if (res.ok) {
//             console.log("Country added:", countryData.name);
//             return data.visit;
//         } else if (res.status === 409) {
//             console.log("Already visited:", countryData.name);
//             alert(`You've already marked ${countryData.name} as visited!`);
//             return null;
//         } else {
//             console.error("Error:", data.error);
//             alert(`Failed to add ${countryData.name}: ${data.error}`);
//             return null;
//         }
//     } catch (error) {
//         console.error("Request error:", error);
//         alert("Failed to connect to server");
//         return null;
//     }
// }


// export async function loadVisitedCountries() {
//     const token = localStorage.getItem("accessToken");
    
//     if (!token) {
//         return [];
//     }
    
//     try {
//         const res = await fetch("http://localhost:3000/visits/my", {
//             headers: {
//                 "Authorization": `Bearer ${token}`
//             }
//         });
        
//         const data = await res.json();
        
//         if (res.ok) {
//             return data.visits || [];
//         } else {
//             console.error("Failed to load visits:", data.error);
//             return [];
//         }
//     } catch (error) {
//         console.error("Failed to load visits:", error);
//         return [];
//     }
// }
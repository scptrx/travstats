import { map } from "../core/mapConfig.js";
import { loadVisitedCities } from "../visits/cityVisitManager.js";
import { openCityPanel } from "../panels/cityPanel.js";

let visitedCitiesCache = [];
let cityMarkers = [];

export async function loadAndDisplayVisitedCities() {
    visitedCitiesCache = await loadVisitedCities();
    console.log("visitedCitiesCache:", visitedCitiesCache);

    cityMarkers.forEach((marker) => marker.remove());
    cityMarkers = [];

    visitedCitiesCache.forEach((visit) => {
        const marker = new maplibregl.Marker({ color: "#4CAF50" })
            .setLngLat([visit.cities.longitude, visit.cities.latitude])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>${visit.cities.name}</strong>`))
            .addTo(map);

        marker.getElement().addEventListener("click", () => {
            openCityPanel(visit.cities, visit, () => {
                loadAndDisplayVisitedCities();
            });
        });

        cityMarkers.push(marker);
    });
}

// export function addCityFromSearch(cityData) {
//     const marker = new maplibregl.Marker({ color: "#ff8f1e" }).setLngLat([cityData.lon, cityData.lat]).addTo(map);

//     map.flyTo({
//         center: [cityData.lon, cityData.lat],
//         zoom: 12,
//         duration: 2000
//     });

//     openCityPanel(
//         {
//             name: cityData.name,
//             latitude: cityData.lat,
//             longitude: cityData.lon,
//             country: cityData.country,
//             displayName: cityData.display_name
//         },
//         null,
//         () => {
//             marker.remove();
//             loadAndDisplayVisitedCities();
//         }
//     );
// }

export function clearCityMarkers() {
    cityMarkers.forEach((marker) => marker.remove());
    cityMarkers = [];
    visitedCitiesCache = [];
}

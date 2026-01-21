import { map } from "../core/mapConfig.js";
import { loadVisitedCities } from "../visits/cityVisitManager.js";
import { openCityPanel } from "../panels/cityPanel.js";

let visitedCitiesCache = [];
let cityMarkers = [];

export async function loadAndDisplayVisitedCities() {
    visitedCitiesCache = await loadVisitedCities();

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

export function clearCityMarkers() {
    cityMarkers.forEach((marker) => marker.remove());
    cityMarkers = [];
    visitedCitiesCache = [];
}

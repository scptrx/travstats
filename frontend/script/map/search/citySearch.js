import { map } from "../core/mapConfig.js";
import { openCityPanel } from "../panels/cityPanel.js";
import { loadAndDisplayVisitedCities } from "../layers/cityLayer.js";
import { API_URL } from "../../config/api.js";
import { applyMapMode } from "../core/mapModeController.js";

let geocoder = null;
let searchMarkers = new Map();
let activeSearchId = null;

function clearSearchMarkers() {
    searchMarkers.forEach(({ marker }) => marker.remove());
    searchMarkers.clear();
    activeSearchId = null;
}

export function initializeCitySearch() {
    const geocoderApi = {
        forwardGeocode: async (config) => {
            clearSearchMarkers();
            const features = [];

            const response = await fetch(`${API_URL}/geocode/search?query=${encodeURIComponent(config.query)}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const data = await response.json();

            for (const cityData of data.cities) {
                const center = [cityData.longitude, cityData.latitude];
                const featureId = crypto.randomUUID();

                const marker = new maplibregl.Marker({ color: "#ff8f1e" }).setLngLat(center).addTo(map);
                const el = marker.getElement();
                el.style.zIndex = "10";

                marker.getElement().addEventListener("click", () => {
                    openSearchCityById(featureId);
                });

                searchMarkers.set(featureId, { marker, cityData });

                features.push({
                    type: "Feature",
                    geometry: { type: "Point", coordinates: center },
                    place_name: cityData.displayName,
                    properties: { ...cityData, featureId },
                    center
                });
            }

            if (features.length > 0) {
                activeSearchId = features[0].properties.featureId;
                applyMapMode("cities");
                focusSearchCity(activeSearchId);
            }

            return { features };
        }
    };

    geocoder = new MaplibreGeocoder(geocoderApi, {
        maplibregl: maplibregl,
        placeholder: "Add a city...",
        marker: false,
        showResultsWhileTyping: true,
        countries: ""
    });

    const searchContainer = document.getElementById("searchbox");
    if (searchContainer) {
        searchContainer.appendChild(geocoder.onAdd(map));
    }

    geocoder.on("result", (e) => {
        const featureId = e.result.properties.featureId;
        openSearchCityById(featureId);
    });

    geocoder.on("clear", () => {
        clearSearchMarkers();
    });
}

function openSearchCityById(featureId) {
    const entry = searchMarkers.get(featureId);
    if (!entry) return;

    const { marker, cityData } = entry;

    map.flyTo({ center: [cityData.longitude, cityData.latitude], zoom: 12 });

    openCityPanel(cityData, null, () => {
        marker.remove();
        searchMarkers.delete(featureId);
        loadAndDisplayVisitedCities();
    });
}

function focusSearchCity(featureId) {
    searchMarkers.forEach(({ marker }) => {
        marker.getElement().classList.remove("active-search-marker");
    });

    const entry = searchMarkers.get(featureId);
    if (!entry) return;

    entry.marker.getElement().classList.add("active-search-marker");

    map.flyTo({ center: [entry.cityData.longitude, entry.cityData.latitude], zoom: 12 });
}

export function removeCitySearch() {
    if (geocoder) {
        geocoder.onRemove();
        geocoder = null;
    }

    if (searchMarker) {
        searchMarker.remove();
        searchMarker = null;
    }
}

export function handleSearchKey(e) {
    const geocoderElement = geocoder.onAdd(map);
    searchContainer.appendChild(geocoderElement);

    const input = geocoderElement.querySelector("input");

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopImmediatePropagation();
            openSearchCityById(activeSearchId);
        }
    });

    const ids = Array.from(searchMarkers.keys());
    if (!ids.length) return;

    let index = ids.indexOf(activeSearchId);

    if (e.key === "ArrowDown") {
        index = (index + 1) % ids.length;
        activeSearchId = ids[index];
        focusSearchCity(activeSearchId);
    }

    if (e.key === "ArrowUp") {
        index = (index - 1 + ids.length) % ids.length;
        activeSearchId = ids[index];
        focusSearchCity(activeSearchId);
    }
}

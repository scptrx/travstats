import { map } from "../core/mapConfig.js";
import { openCityPanel } from "../panels/cityPanel.js";
import { loadAndDisplayVisitedCities } from "../layers/cityLayer.js";
import { API_URL } from "../../api.js";
import { applyMapMode, setMapMode } from "../core/mapModeController.js";

let geocoder = null;
let searchMarker = null;

export function initializeCitySearch() {
    const geocoderApi = {
        forwardGeocode: async (config) => {
            const features = [];

            try {
                const response = await fetch(`${API_URL}/geocode/search?query=${encodeURIComponent(config.query)}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    console.error("Backend geocoding error:", response.status);
                    return { features };
                }

                const data = await response.json();

                for (const cityData of data.cities) {
                    const center = [cityData.longitude, cityData.latitude];

                    const point = {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: center
                        },
                        place_name: cityData.displayName,
                        properties: cityData,
                        text: cityData.displayName,
                        place_type: ["place"],
                        center
                    };

                    features.push(point);
                }
            } catch (e) {
                console.error(`Failed to forwardGeocode with error: ${e}`);
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
        handleCitySelection(e.result);
    });

    geocoder.on("clear", () => {
        if (searchMarker) {
            searchMarker.remove();
            searchMarker = null;
        }
    });
}

function handleCitySelection(result) {
    applyMapMode("cities");
    const coordinates = result.center;
    const cityData = result.properties;

    if (searchMarker) {
        searchMarker.remove();
    }

    searchMarker = new maplibregl.Marker({ color: "#ff8f1e" }).setLngLat(coordinates).addTo(map);

    map.flyTo({
        center: coordinates,
        zoom: 1000
    });

    console.log("Selected city with extracted data:", cityData);

    openCityPanel(cityData, null, () => {
        if (searchMarker) {
            searchMarker.remove();
            searchMarker = null;
        }
        loadAndDisplayVisitedCities();
    });
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

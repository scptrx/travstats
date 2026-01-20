import { map } from "./mapConfig.js";
import { openCityPanel } from "./panels/cityPanel.js";
import { loadAndDisplayVisitedCities } from "./layers/cityLayer.js";

let geocoder = null;
let searchMarker = null;

export function initializeCitySearch() {
    const geocoderApi = {
        forwardGeocode: async (config) => {
            const features = [];
            try {
                const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
                const response = await fetch(request);
                const geojson = await response.json();

                for (const feature of geojson.features) {
                    const center = [
                        feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
                        feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
                    ];

                    const point = {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: center
                        },
                        place_name: feature.properties.display_name,
                        properties: feature.properties,
                        text: feature.properties.display_name,
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
        placeholder: "Search for a city...",
        marker: false,
        showResultsWhileTyping: true,
        countries: "",
        types: "place,city,town,village"
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
    const coordinates = result.center;
    const properties = result.properties;
    const address = properties.address || {};

    if (searchMarker) {
        searchMarker.remove();
    }

    searchMarker = new maplibregl.Marker({ color: "#ff8f1e" }).setLngLat(coordinates).addTo(map);

    map.flyTo({
        center: coordinates,
        zoom: 12,
        duration: 2000
    });

    const displayParts = properties.display_name.split(",").map((s) => s.trim());
    const region = displayParts[1] || address.state || address.region || null;

    const cityData = {
        name: properties.name || displayParts[0],
        latitude: coordinates[1],
        longitude: coordinates[0],
        country: address.country || displayParts[displayParts.length - 1] || "Unknown",
        region: region,
        state: address.state || null,
        displayName: properties.display_name,
        type: properties.type || "place",
        osm_id: properties.osm_id,
        importance: properties.importance
    };

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

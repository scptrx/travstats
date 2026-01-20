import { addCountryLayers, deleteCountryLayers } from "./layers/countryLayer.js";
import { deleteSubdivisionLayers } from "./layers/subdivisionLayer.js";
import { clearCityMarkers, loadAndDisplayVisitedCities } from "../layers/cityLayer.js";

const MAP_MODE_KEY = "mapMode";

export function getMapMode() {
    return localStorage.getItem(MAP_MODE_KEY) || "countries";
}

export function setMapMode(mode) {
    localStorage.setItem(MAP_MODE_KEY, mode);
}

export function applyMapMode(mode) {
    // deleteCountryLayers();
    // deleteSubdivisionLayers();
    // clearCityMarkers();

    if (mode === "countries") {
        // addCountryLayers();
    }

    if (mode === "subdivisions") {
        // loadAndDisplayVisitedCities();
    }
}

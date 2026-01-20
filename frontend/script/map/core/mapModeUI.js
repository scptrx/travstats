import { getMapMode, setMapMode, applyMapMode } from "./mapModeController.js";

const buttons = {
    countries: document.getElementById("countries-btn"),
    cities: document.getElementById("cities-btn")
};

export function updateActiveButton() {
    const mode = getMapMode();

    Object.entries(buttons).forEach(([key, btn]) => {
        btn.classList.toggle("active", key === mode);
    });
}

export function initMapModeUI() {
    Object.entries(buttons).forEach(([mode, btn]) => {
        btn.addEventListener("click", () => {
            setMapMode(mode);
            updateActiveButton();
            applyMapMode(mode);
        });
    });

    updateActiveButton();
}

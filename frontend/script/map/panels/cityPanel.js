import { updateVisit, deleteVisit } from "../visits/visitManager.js";
import { addCityVisit } from "../visits/cityVisitManager.js";

const panel = document.getElementById("city-panel");
const cityNameEl = document.getElementById("city-name");
const cityCountryEl = document.getElementById("city-country");
const cityCoordinatesEl = document.getElementById("city-coordinates");
const visitDateInput = document.getElementById("city-visit-date-input");
const dateLabel = document.getElementById("city-date-label");
const addBtn = document.getElementById("city-add-btn");
const updateBtn = document.getElementById("city-update-btn");
const deleteBtn = document.getElementById("city-delete-btn");
const closeBtn = document.getElementById("city-panel-close-btn");

let currentCityData = null;
let currentExistingVisit = null;
let currentOnUpdate = null;

const ADD_TEXT = "Mark as Visited";
const UPDATE_TEXT = "Update Visit Date";
const REMOVE_TEXT = "Remove from Visited";

visitDateInput.max = new Date().toISOString().split("T")[0];

function resetButtonsToDefaults() {
    addBtn.disabled = false;
    addBtn.textContent = ADD_TEXT;
    updateBtn.disabled = false;
    updateBtn.textContent = UPDATE_TEXT;
    deleteBtn.disabled = false;
    deleteBtn.textContent = REMOVE_TEXT;
}

export function openCityPanel(cityData, existingVisit, onUpdate) {
    console.log("openCityPanel called with:", cityData);

    currentCityData = cityData;
    currentExistingVisit = existingVisit;
    currentOnUpdate = onUpdate;

    resetButtonsToDefaults();

    cityNameEl.textContent = cityData.name;

    const countryText = cityData.country_name || cityData.country;
    cityCountryEl.textContent = countryText;
    cityCountryEl.closest(".info-item").style.display = countryText ? "flex" : "none";

    cityCoordinatesEl.textContent = `${cityData.latitude.toFixed(4)}°, ${cityData.longitude.toFixed(4)}°`;

    const isVisited = !!existingVisit;

    if (isVisited) {
        visitDateInput.value = existingVisit.visit_date.split("T")[0];
        dateLabel.textContent = "Visit Date";

        addBtn.style.display = "none";
        updateBtn.style.display = "none";

        const revealUpdate = () => (updateBtn.style.display = "block");
        visitDateInput.addEventListener("input", revealUpdate, { once: true });
        visitDateInput.addEventListener("pointerdown", revealUpdate, { once: true });

        deleteBtn.style.display = "block";
    } else {
        visitDateInput.value = new Date().toISOString().split("T")[0];
        dateLabel.textContent = "When did you visit?";

        addBtn.style.display = "block";
        updateBtn.style.display = "none";
        deleteBtn.style.display = "none";
    }

    panel.style.display = "block";
    panel.classList.remove("closing");
}

export function closeCityPanel() {
    panel.classList.add("closing");
    setTimeout(() => {
        panel.style.display = "none";
        panel.classList.remove("closing");
        currentCityData = null;
        currentExistingVisit = null;
        currentOnUpdate = null;
        resetButtonsToDefaults();
    }, 300);
}

closeBtn.addEventListener("click", closeCityPanel);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.style.display !== "none") {
        closeCityPanel();
    }
});

addBtn.addEventListener("click", async () => {
    if (!currentCityData) return;

    const visitDate = visitDateInput.value;
    addBtn.disabled = true;
    addBtn.textContent = "Adding...";

    const visit = await addCityVisit(currentCityData, visitDate);

    if (visit) {
        closeCityPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        addBtn.disabled = false;
        addBtn.textContent = ADD_TEXT;
    }
});

updateBtn.addEventListener("click", async () => {
    if (!currentExistingVisit) return;

    const newDate = visitDateInput.value;
    updateBtn.disabled = true;
    updateBtn.textContent = "Updating...";

    const success = await updateVisit(currentExistingVisit.id, newDate);

    if (success) {
        closeCityPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        updateBtn.disabled = false;
        updateBtn.textContent = UPDATE_TEXT;
    }
});

deleteBtn.addEventListener("click", async () => {
    if (!currentExistingVisit || !currentCityData) return;

    if (!confirm(`Remove ${currentCityData.name} from visited cities?`)) {
        return;
    }

    deleteBtn.disabled = true;
    deleteBtn.textContent = "Removing...";

    const success = await deleteVisit(currentExistingVisit.id);

    if (success) {
        closeCityPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        deleteBtn.disabled = false;
        deleteBtn.textContent = REMOVE_TEXT;
    }
});

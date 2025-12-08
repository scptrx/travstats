import { addSubdivisionVisit, updateVisit, deleteVisit } from "../visitManager.js";
import { deleteSubdivisionLayers } from "../layers/subdivisionLayers.js";
import { addCountryLayers, loadAndHighlightVisitedCountries } from "../layers/countryLayers.js";
import { clearSelectedSubdivision } from "../layers/subdivisionLayers.js";

const panel = document.getElementById("subdivision-panel");
const subdivisionNameEl = document.getElementById("subdivision-name");
const subdivisionCountryEl = document.getElementById("subdivision-country");
const subdivisionVisitDateInput = document.getElementById("subdivision-visit-date-input");
const subdivisionDateLabel = document.getElementById("subdivision-date-label");
const subdivisionAddBtn = document.getElementById("subdivision-add-btn");
const subdivisionUpdateBtn = document.getElementById("subdivision-update-btn");
const subdivisionDeleteBtn = document.getElementById("subdivision-delete-btn");
const subdivisionCloseBtn = document.getElementById("subdivision-panel-close-btn");
const countriesBtn = document.getElementById("countries-btn");

let currentSubdivisionData = null;
let currentExistingVisit = null;
let currentOnUpdate = null;

const ADD_TEXT = "Mark as Visited";
const UPDATE_TEXT = "Update Visit Date";
const REMOVE_TEXT = "Remove from Visited";

subdivisionVisitDateInput.max = new Date().toISOString().split("T")[0];

function resetButtonsToDefaults() {
    subdivisionAddBtn.disabled = false;
    subdivisionAddBtn.textContent = ADD_TEXT;
    subdivisionUpdateBtn.disabled = false;
    subdivisionUpdateBtn.textContent = UPDATE_TEXT;
    subdivisionDeleteBtn.disabled = false;
    subdivisionDeleteBtn.textContent = REMOVE_TEXT;
}

export function openSubdivisionPanel(subdivisionData, existingVisit, onUpdate) {
    currentSubdivisionData = subdivisionData;
    currentExistingVisit = existingVisit;
    currentOnUpdate = onUpdate;

    resetButtonsToDefaults();

    subdivisionNameEl.textContent = subdivisionData.name;
    subdivisionCountryEl.textContent = subdivisionData.type || "Subdivision";

    console.log("existingVisit:", existingVisit);
    console.log("subdivisionData:", subdivisionData);

    const isVisited = !!existingVisit;
    console.log("isVisited:", isVisited);

    if (isVisited) {
        subdivisionVisitDateInput.value = existingVisit.visit_date.split("T")[0];
        subdivisionDateLabel.textContent = "Visit Date";

        subdivisionAddBtn.style.display = "none";
        subdivisionUpdateBtn.style.display = "none";

        const revealUpdate = () => (subdivisionUpdateBtn.style.display = "block");
        subdivisionVisitDateInput.addEventListener("input", revealUpdate, { once: true });
        subdivisionVisitDateInput.addEventListener("pointerdown", revealUpdate, { once: true });

        subdivisionDeleteBtn.style.display = "block";
    } else {
        subdivisionVisitDateInput.value = new Date().toISOString().split("T")[0];
        subdivisionDateLabel.textContent = "When did you visit?";

        subdivisionAddBtn.style.display = "block";
        subdivisionUpdateBtn.style.display = "none";
        subdivisionDeleteBtn.style.display = "none";
    }

    panel.style.display = "block";
    panel.classList.remove("closing");
}

export function closeSubdivisionPanel() {
    clearSelectedSubdivision();
    panel.classList.add("closing");
    setTimeout(() => {
        panel.style.display = "none";
        panel.classList.remove("closing");
        currentSubdivisionData = null;
        currentExistingVisit = null;
        currentOnUpdate = null;
        resetButtonsToDefaults();
    }, 300);
}

subdivisionCloseBtn.addEventListener("click", () => {
    closeSubdivisionPanel();
    deleteSubdivisionLayers();
    addCountryLayers();
    loadAndHighlightVisitedCountries();
});

countriesBtn.addEventListener("click", () => {
    closeSubdivisionPanel();
    deleteSubdivisionLayers();
    addCountryLayers();
    loadAndHighlightVisitedCountries();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.style.display !== "none") {
        closeSubdivisionPanel();
        deleteSubdivisionLayers();
        addCountryLayers();
        loadAndHighlightVisitedCountries();
    }
});

subdivisionAddBtn.addEventListener("click", async () => {
    if (!currentSubdivisionData) return;

    const visitDate = subdivisionVisitDateInput.value;
    subdivisionAddBtn.disabled = true;
    subdivisionAddBtn.textContent = "Adding...";

    const visit = await addSubdivisionVisit(currentSubdivisionData, visitDate);

    if (visit) {
        closeSubdivisionPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        subdivisionAddBtn.disabled = false;
        subdivisionAddBtn.textContent = ADD_TEXT;
    }
});

subdivisionUpdateBtn.addEventListener("click", async () => {
    if (!currentExistingVisit) return;

    const newDate = subdivisionVisitDateInput.value;
    subdivisionUpdateBtn.disabled = true;
    subdivisionUpdateBtn.textContent = "Updating...";

    const success = await updateVisit(currentExistingVisit.id, newDate);

    if (success) {
        closeSubdivisionPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        subdivisionUpdateBtn.disabled = false;
        subdivisionUpdateBtn.textContent = UPDATE_TEXT;
    }
});

subdivisionDeleteBtn.addEventListener("click", async () => {
    if (!currentExistingVisit || !currentSubdivisionData) return;

    if (!confirm(`Remove ${currentSubdivisionData.name} from visited subdivisions?`)) {
        return;
    }

    subdivisionDeleteBtn.disabled = true;
    subdivisionDeleteBtn.textContent = "Removing...";

    const success = await deleteVisit(currentExistingVisit.id);

    if (success) {
        closeSubdivisionPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        subdivisionDeleteBtn.disabled = false;
        subdivisionDeleteBtn.textContent = REMOVE_TEXT;
    }
});

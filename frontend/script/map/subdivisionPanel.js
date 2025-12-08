import { addSubdivisionVisit, updateSubdivisionVisit, deleteSubdivisionVisit } from "./visitManager.js";

const panel = document.getElementById("subdivision-panel");
const subdivisionNameEl = document.getElementById("subdivision-name");
const subdivisionCountryEl = document.getElementById("subdivision-country");
const subdivisionVisitDateInput = document.getElementById("subdivision-visit-date-input");
const subdivisionDateLabel = document.getElementById("subdivision-date-label");
const subdivisionAddBtn = document.getElementById("subdivision-add-btn");
const subdivisionUpdateBtn = document.getElementById("subdivision-update-btn");
const subdivisionDeleteBtn = document.getElementById("subdivision-delete-btn");
const subdivisionCloseBtn = document.getElementById("subdivision-panel-close-btn");

let currentSubdivisionData = null;
let currentExistingVisit = null;
let currentOnUpdate = null;

subdivisionVisitDateInput.max = new Date().toISOString().split("T")[0];

export function openSubdivisionPanel(subdivisionData, existingVisit, onUpdate) {
    currentSubdivisionData = subdivisionData;
    currentExistingVisit = existingVisit;
    currentOnUpdate = onUpdate;

    subdivisionNameEl.textContent = subdivisionData.name;
    subdivisionCountryEl.textContent = subdivisionData.type || "Subdivision";

    const isVisited = !!existingVisit;

    if (isVisited) {
        subdivisionVisitDateInput.value = existingVisit.visit_date.split("T")[0];
        subdivisionDateLabel.textContent = "Visit Date";

        subdivisionAddBtn.style.display = "none";
        subdivisionUpdateBtn.style.display = "block";
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
    panel.classList.add("closing");
    setTimeout(() => {
        panel.style.display = "none";
        panel.classList.remove("closing");
        currentSubdivisionData = null;
        currentExistingVisit = null;
        currentOnUpdate = null;
    }, 300);
}

subdivisionCloseBtn.addEventListener("click", closeSubdivisionPanel);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.style.display !== "none") {
        closeSubdivisionPanel();
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
        subdivisionAddBtn.textContent = "Mark as Visited";
    }
});

subdivisionUpdateBtn.addEventListener("click", async () => {
    if (!currentExistingVisit) return;

    const newDate = subdivisionVisitDateInput.value;
    subdivisionUpdateBtn.disabled = true;
    subdivisionUpdateBtn.textContent = "Updating...";

    const success = await updateSubdivisionVisit(currentExistingVisit.id, newDate);

    if (success) {
        closeSubdivisionPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        subdivisionUpdateBtn.disabled = false;
        subdivisionUpdateBtn.textContent = "Update Visit Date";
    }
});

subdivisionDeleteBtn.addEventListener("click", async () => {
    if (!currentExistingVisit || !currentSubdivisionData) return;

    if (!confirm(`Remove ${currentSubdivisionData.name} from visited subdivisions?`)) {
        return;
    }

    subdivisionDeleteBtn.disabled = true;
    subdivisionDeleteBtn.textContent = "Removing...";

    const success = await deleteSubdivisionVisit(currentExistingVisit.id);

    if (success) {
        closeSubdivisionPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        subdivisionDeleteBtn.disabled = false;
        subdivisionDeleteBtn.textContent = "Remove from Visited";
    }
});

import { addCountryVisit, updateCountryVisit, deleteCountryVisit } from './visitManager.js';

const panel = document.getElementById('country-panel');
const countryNameEl = document.getElementById('country-name');
const countryRegionEl = document.getElementById('country-region');
const visitDateInput = document.getElementById('visit-date-input');
const dateLabel = document.getElementById('date-label');
const addBtn = document.getElementById('add-btn');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');
const closeBtn = document.getElementById('panel-close-btn');

let currentCountryData = null;
let currentExistingVisit = null;
let currentOnUpdate = null;

const ADD_TEXT = 'Mark as Visited';
const UPDATE_TEXT = 'Update Visit Date';
const REMOVE_TEXT = 'Remove from Visited';

visitDateInput.max = new Date().toISOString().split('T')[0];

function resetButtonsToDefaults() {
    addBtn.disabled = false;
    addBtn.textContent = ADD_TEXT;
    updateBtn.disabled = false;
    updateBtn.textContent = UPDATE_TEXT;
    deleteBtn.disabled = false;
    deleteBtn.textContent = REMOVE_TEXT;
}

export function openCountryPanel(countryData, existingVisit, onUpdate) {
    currentCountryData = countryData;
    currentExistingVisit = existingVisit;
    currentOnUpdate = onUpdate;

    resetButtonsToDefaults();

    countryNameEl.textContent = countryData.name;
    countryRegionEl.textContent = countryData.region || 'Unknown region';

    const isVisited = !!existingVisit;
    
    if (isVisited) {
        visitDateInput.value = existingVisit.visit_date.split('T')[0];
        dateLabel.textContent = 'Visit Date';
        
        addBtn.style.display = 'none';
        updateBtn.style.display = 'block';
        deleteBtn.style.display = 'block';
    } else {
        visitDateInput.value = new Date().toISOString().split('T')[0];
        dateLabel.textContent = 'When did you visit?';
        
        addBtn.style.display = 'block';
        updateBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
    }

    panel.style.display = 'block';
    panel.classList.remove('closing');
}

export function closeCountryPanel() {
    panel.classList.add('closing');
    setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('closing');
        currentCountryData = null;
        currentExistingVisit = null;
        currentOnUpdate = null;
        resetButtonsToDefaults();
    }, 300);
}

closeBtn.addEventListener('click', closeCountryPanel);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.style.display !== 'none') {
        closeCountryPanel();
    }
});

addBtn.addEventListener('click', async () => {
    if (!currentCountryData) return;
    
    const visitDate = visitDateInput.value;
    addBtn.disabled = true;
    addBtn.textContent = 'Adding...';
    
    const visit = await addCountryVisit(currentCountryData.code, currentCountryData, visitDate);
    
    if (visit) {
        closeCountryPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        addBtn.disabled = false;
        addBtn.textContent = ADD_TEXT;
    }
});

updateBtn.addEventListener('click', async () => {
    if (!currentExistingVisit) return;
    
    const newDate = visitDateInput.value;
    updateBtn.disabled = true;
    updateBtn.textContent = 'Updating...';
    
    const success = await updateCountryVisit(currentExistingVisit.id, newDate);
    
    if (success) {
        closeCountryPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        updateBtn.disabled = false;
        updateBtn.textContent = UPDATE_TEXT;
    }
});

deleteBtn.addEventListener('click', async () => {
    if (!currentExistingVisit || !currentCountryData) return;
    
    if (!confirm(`Remove ${currentCountryData.name} from visited countries?`)) {
        return;
    }
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Removing...';
    
    const success = await deleteCountryVisit(currentExistingVisit.id);
    
    if (success) {
        closeCountryPanel();
        if (currentOnUpdate) currentOnUpdate();
    } else {
        deleteBtn.disabled = false;
        deleteBtn.textContent = REMOVE_TEXT;
    }
});
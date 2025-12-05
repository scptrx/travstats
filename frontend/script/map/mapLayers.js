import { map, whiteMapStyle, blackMapStyle, satelliteMapStyle } from './mapConfig.js';
import { addCountryVisit, loadVisitedCountries } from './visitManager.js'; // ← Импорт

map.on('load', () => {
    addCountryLayers();
    loadAndHighlightVisitedCountries();
});

export function setMapStyle(styleURL) {
    map.setStyle(styleURL);
    map.once('styledata', () => {
        addCountryLayers();
        loadAndHighlightVisitedCountries();
    });
}

document.getElementById('whiteButton').onclick = () => setMapStyle(whiteMapStyle);
document.getElementById('blackButton').onclick = () => setMapStyle(blackMapStyle);
document.getElementById('satelliteButton').onclick = () => setMapStyle(satelliteMapStyle);

async function loadAndHighlightVisitedCountries() {
    const visits = await loadVisitedCountries();
    
    if (visits.length > 0) {
        const visitedIsoCodes = visits.map(v => v.countries.iso_code);
        
        map.setFilter('highlight-country', [
            'in', 
            'adm0_a3', 
            ...visitedIsoCodes
        ]);
        
        console.log(`Loaded ${visits.length} visited countries`);
    }
}

export function addCountryLayers() {
    if (!map.getSource('countries')) {
        map.addSource('countries', {
            type: 'geojson',
            data: 'assets/geodata/countries_50.geojson'
        });
    }
    
    if (!map.getLayer('countries-border')) {
        map.addLayer({
            id: 'countries-border',
            type: 'line',
            source: 'countries',
            paint: {
                'line-color': '#ff8f1eff',
                'line-width': 1
            }
        });
    }
    
    if (!map.getLayer('hover-border')) {
        map.addLayer({
            id: 'hover-border',
            type: 'line',
            source: 'countries',
            paint: {
                'line-color': '#ff8f1eff',
                'line-width': 3
            },
            filter: ['==', 'adm0_a3', '']
        });
    }
    
    if (!map.getLayer('highlight-country')) {
        map.addLayer({
            id: 'highlight-country',
            type: 'fill',
            source: 'countries',
            paint: {
                'fill-color': '#ffc170ff',
                'fill-opacity': 0.6
            },
            filter: ['==', 'adm0_a3', '']
        });
    }
    
    if (!map.getLayer('countries-fill')) {
        map.addLayer({
            id: 'countries-fill',
            type: 'fill',
            source: 'countries',
            paint: {
                'fill-color': '#ffc170ff',
                'fill-opacity': 0.2
            }
        });
    }
    
    
    if (!map.hoverHandlerAdded) {
        map.on('mousemove', 'countries-fill', (e) => {
            if (!e.features || !e.features.length) {
                map.setFilter('hover-border', ['==', 'adm0_a3', '']);
                return;
            }
            const code = e.features[0].properties.adm0_a3;
            map.setFilter('hover-border', ['==', 'adm0_a3', code]);
        });
        
        map.on('mouseleave', 'countries-fill', () => {
            map.setFilter('hover-border', ['==', 'adm0_a3', '']);
        });
        
        map.hoverHandlerAdded = true;
    }
    
    if (!map.clickHandlerAdded) {
        map.on('click', 'countries-fill', async (e) => {
            if (!e.features || !e.features.length) return;

            const props = e.features[0].properties;
            const code = props.adm0_a3;
            const name = props.name;

            console.log("CLICKED:", name, code);
        
            const visit = await addCountryVisit(
                code,
                { name: name, region: props.continent || null }
            );
        
            if (visit) {
                loadAndHighlightVisitedCountries();
                alert(`${name} added to your travels!`);
            }
        });
        loadAndHighlightVisitedCountries();

        map.clickHandlerAdded = true;
    }
}

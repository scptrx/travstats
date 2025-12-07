import { map, whiteMapStyle, blackMapStyle } from './mapConfig.js';
import { addCountryVisit, loadVisitedCountries } from './visitManager.js'; 

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

// document.getElementById('whiteButton').onclick = () => setMapStyle(whiteMapStyle);
// document.getElementById('blackButton').onclick = () => setMapStyle(blackMapStyle);

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
            data: 'assets/geodata/countries_50.geojson',
            generateId: true
        });
    }
    
    if (!map.getLayer('countries-fill')) {
        map.addLayer({
            id: 'countries-fill',
            type: 'fill',
            source: 'countries',
            paint: {
                'fill-color': '#ffc170',
                'fill-opacity': 0.2
            }
        });
    }

    if (!map.getLayer('highlight-country')) {
        map.addLayer({
            id: 'highlight-country',
            type: 'fill',
            source: 'countries',
            paint: {
                'fill-color': '#4CAF50', 
                'fill-opacity': 0.6
            },
            filter: ['in', 'adm0_a3', ''] 
        });
    }

    if (!map.getLayer('countries-hover')) {
        map.addLayer({
            id: 'countries-hover',
            type: 'fill',
            source: 'countries',
            paint: {
                'fill-color': '#ff8f1e',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.6,
                    0
                ]
            }
        });
    }

    if (!map.getLayer('countries-outline')) {
        map.addLayer({
            id: 'countries-outline',
            type: 'line',
            source: 'countries',
            paint: {
                'line-color': '#333',
                'line-width': 1
            }
        });
    }

    if (!map.hoverHandlerAdded) {
        let hoveredId = null;

        map.on('mousemove', 'countries-hover', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            
            if (!e.features || !e.features.length) {
                if (hoveredId !== null) {
                    map.setFeatureState(
                        { source: 'countries', id: hoveredId },
                        { hover: false }
                    );
                    hoveredId = null;
                }
                return;
            }

            const id = e.features[0].id;

            if (id !== hoveredId) {
                if (hoveredId !== null) {
                    map.setFeatureState(
                        { source: 'countries', id: hoveredId },
                        { hover: false }
                    );
                }

                map.setFeatureState(
                    { source: 'countries', id },
                    { hover: true }
                );

                hoveredId = id;
            }
        });

        map.on('mouseleave', 'countries-hover', () => {
            map.getCanvas().style.cursor = '';
            
            if (hoveredId !== null) {
                map.setFeatureState(
                    { source: 'countries', id: hoveredId },
                    { hover: false }
                );
                hoveredId = null;
            }
        });

        map.hoverHandlerAdded = true;
    }

    if (!map.clickHandlerAdded) {
        map.on('click', 'countries-hover', async (e) => {
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

        map.clickHandlerAdded = true;
    }
}

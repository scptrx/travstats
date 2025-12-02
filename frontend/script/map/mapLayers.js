import { map, whiteMapStyle, blackMapStyle, satelliteMapStyle } from './mapConfig.js';

map.on('load', addCountryLayers);

export function setMapStyle(styleURL) {
    map.setStyle(styleURL);
    map.once('styledata', addCountryLayers);
}

document.getElementById('whiteButton').onclick = () => setMapStyle(whiteMapStyle);
document.getElementById('blackButton').onclick = () => setMapStyle(blackMapStyle);
document.getElementById('satelliteButton').onclick = () => setMapStyle(satelliteMapStyle);

export function addCountryLayers() {
    if (!map.getSource('countries')) {
        map.addSource('countries', {
            type: 'geojson',
            data: 'assets/geodata/countries_110.geojson'
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
        map.on('click', 'countries-fill', (e) => {
            if (!e.features || !e.features.length) return;
            const props = e.features[0].properties;
            const code = props.adm0_a3;
            const name = props.name;

            map.setFilter('highlight-country', ['==', 'adm0_a3', code]);
            console.log("CLICKED:", name, code);
        });

        map.clickHandlerAdded = true;
    }
}

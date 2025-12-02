const MAPTILER_API_KEY = 'LHHpvjCDKVfuiPq4D8wa';

const blackMapStyle = 'https://api.maptiler.com/maps/019adaf0-84d9-7ddb-801a-02b5770c2fc3/style.json?key=' + MAPTILER_API_KEY;
const whiteMapStyle = 'https://api.maptiler.com/maps/019adaf0-d3f6-7618-98a2-99ef9942c4d8/style.json?key=' + MAPTILER_API_KEY;
const satelliteMapStyle = 'https://api.maptiler.com/maps/019adb04-1d43-78c4-9ab6-9e2070be2ee3/style.json?key=' + MAPTILER_API_KEY;

const map = new maplibregl.Map({
    container: 'map',
    style: whiteMapStyle, 
    center: [20, 49],
    zoom: 6,
    pitch: 0,     
    bearing: 0     
});

function setMapStyle(styleURL) {
    map.setStyle(styleURL);
    map.once('styledata', addCountryLayers);
}

document.getElementById('whiteButton').onclick = () => setMapStyle(whiteMapStyle);
document.getElementById('blackButton').onclick = () => setMapStyle(blackMapStyle);
document.getElementById('satelliteButton').onclick = () => setMapStyle(satelliteMapStyle);


map.dragRotate.disable(); 

function addCountryLayers() {
    if (!map.getSource('countries')) {
        map.addSource('countries', {
            type: 'geojson',
            data: 'assets/geodata/countries_110.geojson'
        });
    }

    // Слой всех границ
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

    // Hover граница
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

    // Click fill (выделенная страна)
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

    // Hover fill (невидимая, для ловли мышки)
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

    // Hover обработчик на fill
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

    // Click обработчик на fill
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

// Инициализация
map.on('load', addCountryLayers);


// from oficial docs

// // OpenStreetMap tile layer
// const map = new maplibregl.Map({
//   container: 'map',
//   style: {
//     version: 8,
//     sources: {
//       'osm-tiles': {
//         type: 'raster',
//         tiles: [
//           'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
//         ],
//         tileSize: 256
//       }
//     },
//     layers: [
//       {
//         id: 'osm-layer',
//         type: 'raster',
//         source: 'osm-tiles'
//       }
//     ]
//   },
//   center: [20, 49],
//   zoom: 6,
//   pitch: 0,
//   bearing: 0
// });


// const geojsonData = {
//   "type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "geometry": {
//         "type": "Point",
//         "coordinates": [20, 49]
//       },
//       "properties": {
//         "name": "Пример точки"
//       }
//     }
//   ]
// };

// map.on('load', () => {
//   map.addSource('my-geojson', { type: 'geojson', data: geojsonData });

//   map.addLayer({
//     id: 'points',
//     type: 'circle',
//     source: 'my-geojson',
//     paint: {
//       'circle-radius': 6,
//       'circle-color': '#ff0000'
//     }
//   });
// });




// let hoveredStateId = null;

// const marker = new maplibregl.Marker()
//         .setLngLat([12.550343, 55.665957])
//         .addTo(map);

//         map.on('load', () => {
//         map.addSource('states', {
//             'type': 'geojson',
//             'data':
//                 'https://maplibre.org/maplibre-gl-js/docs/assets/us_states.geojson'
//         });

//         // The feature-state dependent fill-opacity expression will render the hover effect
//         // when a feature's hover state is set to true.
//         map.addLayer({
//             'id': 'state-fills',
//             'type': 'fill',
//             'source': 'states',
//             'layout': {},
//             'paint': {
//                 'fill-color': '#627BC1',
//                 'fill-opacity': [
//                     'case',
//                     ['boolean', ['feature-state', 'hover'], false],
//                     1,
//                     0.5
//                 ]
//             }
//         });

//         map.addLayer({
//             'id': 'state-borders',
//             'type': 'line',
//             'source': 'states',
//             'layout': {},
//             'paint': {
//                 'line-color': '#627BC1',
//                 'line-width': 2
//             }
//         });

//         // When the user moves their mouse over the state-fill layer, we'll update the
//         // feature state for the feature under the mouse.
//         map.on('mousemove', 'state-fills', (e) => {
//             if (e.features.length > 0) {
//                 if (hoveredStateId) {
//                     map.setFeatureState(
//                         {source: 'states', id: hoveredStateId},
//                         {hover: false}
//                     );
//                 }
//                 hoveredStateId = e.features[0].id;
//                 map.setFeatureState(
//                     {source: 'states', id: hoveredStateId},
//                     {hover: true}
//                 );
//             }
//         });

//         // When the mouse leaves the state-fill layer, update the feature state of the
//         // previously hovered feature.
//         map.on('mouseleave', 'state-fills', () => {
//             if (hoveredStateId) {
//                 map.setFeatureState(
//                     {source: 'states', id: hoveredStateId},
//                     {hover: false}
//                 );
//             }
//             hoveredStateId = null;
//         });
//     });

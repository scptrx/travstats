const MAPTILER_API_KEY = 'LHHpvjCDKVfuiPq4D8wa';

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019adaf0-84d9-7ddb-801a-02b5770c2fc3/style.json?key=' + MAPTILER_API_KEY, 
    center: [20, 49],
    zoom: 6,
    pitch: 0,     
    bearing: 0     
});

document.getElementById('whiteButton').onclick = () => {
    map.setStyle('https://api.maptiler.com/maps/019adaf0-d3f6-7618-98a2-99ef9942c4d8/style.json?key=' + MAPTILER_API_KEY    );
};

document.getElementById('blackButton').onclick = () => {
    map.setStyle('https://api.maptiler.com/maps/019adaf0-84d9-7ddb-801a-02b5770c2fc3/style.json?key=' + MAPTILER_API_KEY    );
};

document.getElementById('satelliteButton').onclick = () => {
    map.setStyle('https://api.maptiler.com/maps/019adb04-1d43-78c4-9ab6-9e2070be2ee3/style.json?key=' + MAPTILER_API_KEY    );
}
map.dragRotate.disable();  

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

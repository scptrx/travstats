const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // плоский стиль
    center: [20, 49],
    zoom: 6,
    pitch: 0,      // наклон камеры 0° 
    bearing: 0     // поворот карты 0°
});

map.dragRotate.disable();  

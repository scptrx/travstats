export const MAPTILER_API_KEY = 'LHHpvjCDKVfuiPq4D8wa';

export const blackMapStyle = 'https://api.maptiler.com/maps/019adaf0-84d9-7ddb-801a-02b5770c2fc3/style.json?key=' + MAPTILER_API_KEY;
export const whiteMapStyle = 'https://api.maptiler.com/maps/019adaf0-d3f6-7618-98a2-99ef9942c4d8/style.json?key=' + MAPTILER_API_KEY;

export const map = new maplibregl.Map({
    container: 'map',
    style: whiteMapStyle,
    center: [20, 49],
    zoom: 6
});

map.dragRotate.disable();

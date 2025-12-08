import { map } from "../mapConfig.js";
import { loadVisitedSubdivisions } from "../visitManager.js";
import { deleteCountryLayers } from "./countryLayers.js";
import { openSubdivisionPanel } from "../panels/subdivisionPanel.js";

let visitedSubdivisionsCache = [];

export function renderSubdivisionLayers(countryIsoCode) {
    deleteCountryLayers();
    if (!map.getSource("subdivisions")) {
        map.addSource("subdivisions", {
            type: "geojson",
            data: "assets/geodata/subdivisions/gadm36_" + countryIsoCode + "_1.json",
            generateId: true
        });
    }
    addSubdivisionMapLayers();
    loadAndHighlightVisitedSubdivisions(countryIsoCode);
}

async function loadAndHighlightVisitedSubdivisions(countryIsoCode) {
    visitedSubdivisionsCache = await loadVisitedSubdivisions(countryIsoCode);

    console.log("visitedSubdivisionsCache:", visitedSubdivisionsCache);

    if (visitedSubdivisionsCache.length > 0) {
        const visitedCodes = visitedSubdivisionsCache.filter((v) => v.subdivisions).map((v) => v.subdivisions.code);

        console.log("visitedCodes:", visitedCodes);

        if (visitedCodes.length > 0) map.setFilter("highlight-subdivision", ["in", "GID_1", ...visitedCodes]);
    } else {
        map.setFilter("highlight-subdivision", ["in", "GID_1", ""]);
    }
}

function addSubdivisionMapLayers() {
    if (!map.getLayer("subdivisions-fill")) {
        map.addLayer({
            id: "subdivisions-fill",
            type: "fill",
            source: "subdivisions",
            paint: {
                "fill-color": "#ffc170",
                "fill-opacity": 0.2
            }
        });
    }

    if (!map.getLayer("highlight-subdivision")) {
        map.addLayer({
            id: "highlight-subdivision",
            type: "fill",
            source: "subdivisions",
            paint: {
                "fill-color": "#4CAF50",
                "fill-opacity": 0.6
            },
            filter: ["in", "GID_1", ""]
        });
    }

    if (!map.getLayer("active-subdivision")) {
        map.addLayer({
            id: "active-subdivision",
            type: "line",
            source: "subdivisions",
            paint: {
                "line-color": "#ff8f1e",
                "line-width": 3
            },
            filter: ["in", "GID_1", ""]
        });
    }

    if (!map.getLayer("subdivisions-hover")) {
        map.addLayer({
            id: "subdivisions-hover",
            type: "fill",
            source: "subdivisions",
            paint: {
                "fill-color": "#ff8f1e",
                "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.6, 0]
            }
        });
    }

    if (!map.getLayer("subdivisions-outline")) {
        map.addLayer({
            id: "subdivisions-outline",
            type: "line",
            source: "subdivisions",
            paint: {
                "line-color": "#333",
                "line-width": 1.5
            }
        });
    }

    if (!map.subdivisionHoverHandlerAdded) {
        let hoveredId = null;

        map.on("mousemove", "subdivisions-hover", (e) => {
            map.getCanvas().style.cursor = "pointer";

            if (!e.features || !e.features.length) {
                if (hoveredId !== null) {
                    map.setFeatureState({ source: "subdivisions", id: hoveredId }, { hover: false });
                    hoveredId = null;
                }
                return;
            }

            const id = e.features[0].id;

            if (id !== hoveredId) {
                if (hoveredId !== null) {
                    map.setFeatureState({ source: "subdivisions", id: hoveredId }, { hover: false });
                }

                map.setFeatureState({ source: "subdivisions", id }, { hover: true });

                hoveredId = id;
            }
        });

        map.on("mouseleave", "subdivisions-hover", () => {
            map.getCanvas().style.cursor = "";

            if (hoveredId !== null) {
                map.setFeatureState({ source: "subdivisions", id: hoveredId }, { hover: false });
                hoveredId = null;
            }
        });

        map.subdivisionHoverHandlerAdded = true;
    }

    if (!map.subdivisionClickHandlerAdded) {
        map.on("click", "subdivisions-hover", async (e) => {
            if (!e.features || !e.features.length) return;

            const props = e.features[0].properties;
            const code = props.GID_1;

            map.setFilter("active-subdivision", ["in", "GID_1", e.features[0].properties.GID_1]);

            if (!visitedSubdivisionsCache.length) {
                await loadAndHighlightVisitedSubdivisions(props.GID_0);
            }

            const existingVisit = visitedSubdivisionsCache.find((v) => v.subdivisions && v.subdivisions.code === code);

            openSubdivisionPanel(
                {
                    name: props.NAME_1,
                    code: code,
                    country: props.NAME_0,
                    countryCode: props.GID_0,
                    type: props.ENGTYPE_1 == props.TYPE_1 ? props.TYPE_1 : `${props.TYPE_1} (${props.ENGTYPE_1})`
                },
                existingVisit,
                () => loadAndHighlightVisitedSubdivisions(props.GID_0)
            );
        });
        map.subdivisionClickHandlerAdded = true;
    }
}

export function deleteSubdivisionLayers() {
    const layers = ["subdivisions-fill", "highlight-subdivision", "subdivisions-hover", "subdivisions-outline", "active-subdivision"];

    layers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });

    if (map.getSource("subdivisions")) {
        map.removeSource("subdivisions");
    }

    visitedSubdivisionsCache = [];
}

export function clearSelectedSubdivision() {
    map.setFilter("active-subdivision", ["in", "GID_1", ""]);
}

import logger from "../utils/logger.js";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

class Geocode {
    static async searchCities(query) {
        try {
            const request = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
            const response = await fetch(request);
            const data = await response.json();

            if (data.status !== "OK") {
                logger.error("Google Geocoding error", { status: data.status, query });
                return [];
            }

            const validTypes = ["locality", "administrative_area_level_3", "sublocality"];
            const cities = [];

            for (const result of data.results) {
                const hasValidType = result.types.some((type) => validTypes.includes(type));

                if (!hasValidType) {
                    continue;
                }

                const location = result.geometry.location;
                const addressComponents = result.address_components;

                const getComponent = (types) => {
                    const comp = addressComponents.find((c) => types.some((t) => c.types.includes(t)));
                    return comp?.long_name || null;
                };

                const cityComponent = addressComponents.find(
                    (comp) => comp.types.includes("locality") || comp.types.includes("administrative_area_level_3")
                );

                const cityData = {
                    name: cityComponent?.long_name || addressComponents[0]?.long_name,
                    latitude: location.lat,
                    longitude: location.lng,
                    country: getComponent(["country"]) || "Unknown",
                    region: getComponent(["administrative_area_level_1"]),
                    state: getComponent(["administrative_area_level_1"]),
                    displayName: result.formatted_address,
                    type: result.types[0] || "locality",
                    place_id: result.place_id,
                    addressComponents: addressComponents
                };

                cities.push(cityData);
            }

            logger.info("Cities found", { query, count: cities.length });
            return cities;
        } catch (error) {
            logger.error("Geocoding search failed", { error: error.message, query });
            throw new Error(`Failed to search cities: ${error.message}`);
        }
    }
}
export default Geocode;

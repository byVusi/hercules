/**
 * Path to the application's web manifest JSON file.
 * This is a root-relative URL (starts from the site root).
 * @constant {string}
 */
const manifestJSON_Path = "/manifest.json";

/**
 * Path to the workout programs JSON file.
 * This is a root-relative URL to a data asset.
 * @constant {string}
 */
const workoutPrograms_Path = "/assets/data/workoutPrograms.json";

/**
 * Fetches and parses a JSON file from the given URL.
 *
 * @async
 * @function fetchAppData
 * @param {string} url - The URL of the JSON file to fetch.
 * @returns {Promise<any>} The parsed JSON data.
 * @throws {Error} If the fetch fails or the response is not OK.
 */
async function fetchAppData(url = "") {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Unsuccessful fetch. ${response.status}: ${response.statusText}`
			);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error(`Fetch API failed. Error: ${error.message}`);
	}
}

/**
 * Fetches and returns the web app's manifest data.
 *
 * @async
 * @function fetchManifestJSON
 * @returns {Promise<any>} Parsed manifest JSON data.
 */
async function fetchManifestJSON() {
	return await fetchAppData(manifestJSON_Path);
}

/**
 * Fetches and returns the workout programs data.
 *
 * @async
 * @function fetchWorkoutProgramsJSON
 * @returns {Promise<any>} Parsed workout programs JSON data.
 */
async function fetchWorkoutProgramsJSON() {
	return await fetchAppData(workoutPrograms_Path);
}

/**
 * An object containing app-level data fetchers.
 *
 * @namespace appData
 * @property {Function} manifest - Fetches the web app manifest and returns the JSON.
 * @property {Function} workoutPrograms - Fetches workout programs and returns the JSON.
 */
export const appData = {
	manifest: fetchManifestJSON,
	workoutPrograms: fetchWorkoutProgramsJSON,
};

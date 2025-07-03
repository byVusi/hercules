const MANIFEST_URL = "./manifest.json";
const PROGRAMS_URL = "./assets/data/json/programs.json";

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
 * @function fetchManifest
 * @returns {Promise<any>} Parsed manifest JSON data.
 */
async function fetchManifest() {
	return await fetchAppData(MANIFEST_URL);
}

/**
 * Fetches and returns the workout programs data.
 *
 * @async
 * @function fetchPrograms
 * @returns {Promise<any>} Parsed workout programs JSON data.
 */
async function fetchPrograms() {
	return await fetchAppData(PROGRAMS_URL);
}

/**
 * An object containing app-level data fetchers.
 *
 * @namespace APP_DATA
 * @property {Function} manifest - Fetches the web app manifest and returns the JSON.
 * @property {Function} programs - Fetches workout programs and returns the JSON.
 */
export const APP_DATA = {
	manifest: fetchManifest,
	programs: fetchPrograms,
};

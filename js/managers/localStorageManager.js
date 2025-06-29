import { appData } from "../../assets/data/js/fetchAppData.js";

const APP_NAME = (await appData.manifest()).name;
const LAST_DAY_ACCESSED_KEY = `${APP_NAME.trim().toLowerCase()}_last_day_accessed`;
const PREVIOUS_WORKOUT_DAY_KEY = `${APP_NAME.trim().toLowerCase()}_previous_workout_day`;
const defaultProgram = "workout_1";

/**
 * Checks whether `localStorage` is accessible in the current environment.
 *
 * @returns {boolean} `true` if `localStorage` is usable, `false` otherwise.
 */
function isLocalStorageAccessible() {
	try {
		const testKey = "__ls_test__";
		localStorage.setItem(testKey, "1");
		localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}

/**
 * Retrieves a parsed JSON value from `localStorage` by key.
 *
 * @async
 * @param {string} key - The key to look up in `localStorage`.
 * @returns {Promise<unknown|null>} The parsed object or primitive value stored under the key,
 * or `null` if the key is invalid, missing, inaccessible, or contains invalid JSON.
 */
async function fetchFromLocalStorage(key) {
	try {
		if (typeof key !== "string") {
			console.warn(
				`Invalid key type: expected string but got ${typeof key}`
			);
			return null;
		}

		if (!isLocalStorageAccessible()) {
			console.warn("localStorage is not accessible in this environment.");
			return null;
		}

		const raw = localStorage.getItem(key);

		if (raw === null) {
			console.warn(`No value found in localStorage for key: "${key}"`);
			return null;
		}

		try {
			return JSON.parse(raw);
		} catch (parseError) {
			console.warn(
				`Failed to parse JSON for key: "${key}". Raw value: ${raw}`
			);
			return null;
		}
	} catch (err) {
		console.error(
			`Unexpected error accessing localStorage with key "${key}":`,
			err
		);
		return null;
	}
}

/**
 * Serializes a value and saves it to `localStorage` under the given key.
 *
 * @async
 * @param {string} key - The key under which to store the value.
 * @param {unknown} value - The value to be stored. Must be JSON-serializable.
 * @returns {Promise<boolean>} `true` if the operation succeeded, `false` otherwise.
 */
async function saveToLocalStorage(key, value) {
	try {
		if (typeof key !== "string") {
			console.warn(
				`Invalid key type: expected string but got ${typeof key}`
			);
			return false;
		}

		if (!isLocalStorageAccessible()) {
			console.warn("localStorage is not accessible in this environment.");
			return false;
		}

		const serialized = JSON.stringify(value);

		try {
			localStorage.setItem(key, serialized);
			return true;
		} catch (storageError) {
			console.error(
				`Failed to save to localStorage under key "${key}":`,
				storageError
			);
			return false;
		}
	} catch (err) {
		console.error(
			`Unexpected error serializing value for key "${key}":`,
			err
		);
		return false;
	}
}

/**
 * Removes an item from `localStorage` by key.
 *
 * @async
 * @param {string} key - The key to remove from `localStorage`.
 * @returns {Promise<boolean>} `true` if the operation succeeded (or nothing to remove), `false` otherwise.
 */
async function removeFromLocalStorage(key) {
	try {
		if (typeof key !== "string") {
			console.warn(
				`Invalid key type: expected string but got ${typeof key}`
			);
			return false;
		}

		if (!isLocalStorageAccessible()) {
			console.warn("localStorage is not accessible in this environment.");
			return false;
		}

		if (!localStorage.getItem(key)) {
			console.info(
				`No item found in localStorage for key: "${key}". Nothing to remove.`
			);
			return true;
		}

		try {
			localStorage.removeItem(key);
			return true;
		} catch (storageError) {
			console.error(
				`Failed to remove key "${key}" from localStorage:`,
				storageError
			);
			return false;
		}
	} catch (err) {
		console.error(
			`Unexpected error during localStorage removal for key "${key}":`,
			err
		);
		return false;
	}
}

// Function to get the last date application was accessed, or set it to today if not available
export async function lastDateAccessed() {
	const dayPreviouslyAccessed = await localStorageManager.fetch(
		LAST_DAY_ACCESSED_KEY
	);

	if (!dayPreviouslyAccessed || typeof dayPreviouslyAccessed !== "string") {
		const todayString = getTodayString();
		localStorageManager.save(LAST_DAY_ACCESSED_KEY, todayString);
		return todayString;
	}
	return dayPreviouslyAccessed;
}

export function getTodayString() {
	const today = new Date();
	return `${today.getFullYear()}/${
		today.getMonth() + 1 < 10
			? `0${today.getMonth() + 1}`
			: today.getMonth() + 1
	}/${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`; // Format: YYYY/MM/DD
}

async function getWorkoutDay() {
	let previousWorkoutDay = await localStorageManager.fetch(
		PREVIOUS_WORKOUT_DAY_KEY
	);

	if (
		typeof previousWorkoutDay !== "number" ||
		isNaN(previousWorkoutDay) ||
		previousWorkoutDay < 0 ||
		previousWorkoutDay >= 4
	) {
		previousWorkoutDay = 0;
		localStorageManager.save(PREVIOUS_WORKOUT_DAY_KEY, previousWorkoutDay);
	}

	const dayPreviouslyAccessed = await lastDateAccessed();
	const todayString = getTodayString();

	// Move up the workout day if accessing on a new day
	if (dayPreviouslyAccessed !== todayString) {
		localStorageManager.save(LAST_DAY_ACCESSED_KEY, todayString);
		previousWorkoutDay = (previousWorkoutDay + 1) % 4;
		localStorageManager.save(PREVIOUS_WORKOUT_DAY_KEY, previousWorkoutDay);
	}

	//Try to return localStorageManager.fetch(PREVIOUS_WORKOUT_DAY_KEY)—but if that gives you null or undefined, return 0 instead.
	return fetchWithDefault(PREVIOUS_WORKOUT_DAY_KEY, 0);
}

async function fetchWithDefault(key, defaultValue) {
	const result = await localStorageManager.fetch(key);
	return result ?? defaultValue;
}

async function fetchWorkoutData() {
	const programKey = `${APP_NAME.toLowerCase()}_current_program`;
	const workoutPrograms = await appData.workoutPrograms();
	if (!workoutPrograms) return;

	let currentProgram = await localStorageManager.fetch(programKey);

	// If current selected program is not in localStorage, set default program
	if (!currentProgram) {
		currentProgram = defaultProgram;
		await localStorageManager.save(programKey, currentProgram);
	}
	const dayIndex = await localStorageManager.fetchWorkoutDay();
	const workout = workoutPrograms[currentProgram]?.days[dayIndex];

	return workout;
}

async function fetchCurrentProgramme() {
	const storedKey = `${APP_NAME.toLowerCase()}_current_program`;
	return await localStorageManager.fetch(storedKey);
}

async function fetchWorkoutRecords() {
	const storedKey = `${APP_NAME.toLowerCase()}_workout_records`;
	return (await localStorageManager.fetch(storedKey)) || {};
}

/**
 * A utility object to interact with `localStorage` safely and asynchronously.
 *
 * @namespace
 * @property {function(string): Promise<unknown|null>} fetch - Retrieves and parses a value.
 * @property {function(string, unknown): Promise<boolean>} save - Serializes and stores a value.
 * @property {function(string): Promise<boolean>} remove - Removes a stored value.
 */
export const localStorageManager = {
	fetch: fetchFromLocalStorage,
	save: saveToLocalStorage,
	remove: removeFromLocalStorage,
	fetchWorkoutDay: getWorkoutDay,
	fetchWorkout: fetchWorkoutData,
	fetchCurrentProgram: fetchCurrentProgramme,
	fetchWorkoutRecords: fetchWorkoutRecords,
};

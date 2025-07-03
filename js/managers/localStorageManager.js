import { APP_DATA } from "../../assets/data/js/fetchAppData.js";
import { UTILITIES } from "../utils.js";

const APP_NAME = (await APP_DATA.manifest()).name;
const formattedAppName = APP_NAME.trim().toLowerCase();

const LAST_DAY_ACCESSED_KEY = `${formattedAppName}_last_day_accessed`;
const PREVIOUS_WORKOUT_DAY_KEY = `${formattedAppName}_previous_workout_day`;
const CURRENT_PROGRAM_KEY = `${formattedAppName}_current_program`;
const WORKOUT_RECORDS_KEY = `${formattedAppName}_workout_records`;

const DEFAULT_PROGRAM = "workout_1";

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

async function fetchWorkoutData() {
	const workoutPrograms = await APP_DATA.programs();
	if (!workoutPrograms) return;

	let currentProgram = await LOCAL_STORAGE_MANAGER.fetch.program();

	// If current selected program is not in localStorage, set default program
	if (!currentProgram) {
		currentProgram = DEFAULT_PROGRAM;
		await LOCAL_STORAGE_MANAGER.save(CURRENT_PROGRAM_KEY, currentProgram);
	}
	const dayIndex = await LOCAL_STORAGE_MANAGER.fetch.workout.day();
	const workout = workoutPrograms[currentProgram]?.days[dayIndex];

	return workout;
}

async function fetchWorkoutDay() {
	let previousWorkoutDay = await LOCAL_STORAGE_MANAGER.fetch.storage(
		PREVIOUS_WORKOUT_DAY_KEY
	);

	if (
		typeof previousWorkoutDay !== "number" ||
		isNaN(previousWorkoutDay) ||
		previousWorkoutDay < 0 ||
		previousWorkoutDay >= 4
	) {
		previousWorkoutDay = 0;
		LOCAL_STORAGE_MANAGER.save(
			PREVIOUS_WORKOUT_DAY_KEY,
			previousWorkoutDay
		);
	}

	const dayPreviouslyAccessed =
		await LOCAL_STORAGE_MANAGER.fetch.app.date.lastAccessed();
	const todayString = UTILITIES.format.date.todayString();

	// Move up the workout day if accessing on a new day
	if (dayPreviouslyAccessed !== todayString) {
		LOCAL_STORAGE_MANAGER.save(LAST_DAY_ACCESSED_KEY, todayString);
		previousWorkoutDay = (previousWorkoutDay + 1) % 4;
		LOCAL_STORAGE_MANAGER.save(
			PREVIOUS_WORKOUT_DAY_KEY,
			previousWorkoutDay
		);
	}

	//Try to return LOCAL_STORAGE_MANAGER.fetch.storage(PREVIOUS_WORKOUT_DAY_KEY)—but if that gives you null or undefined, return 0 instead.
	return fetchWithDefault(PREVIOUS_WORKOUT_DAY_KEY, 0);
}

// Function to get the last date application was accessed, or set it to today if not available
async function lastDateAccessed() {
	const dayPreviouslyAccessed = await LOCAL_STORAGE_MANAGER.fetch.storage(
		LAST_DAY_ACCESSED_KEY
	);

	if (!dayPreviouslyAccessed || typeof dayPreviouslyAccessed !== "string") {
		const todayString = UTILITIES.format.date.todayString();
		LOCAL_STORAGE_MANAGER.save(LAST_DAY_ACCESSED_KEY, todayString);
		return todayString;
	}
	return dayPreviouslyAccessed;
}

async function fetchWithDefault(key, defaultValue) {
	const result = await LOCAL_STORAGE_MANAGER.fetch.storage(key);
	return result ?? defaultValue;
}

async function fetchCurrentProgram() {
	return await LOCAL_STORAGE_MANAGER.fetch.storage(CURRENT_PROGRAM_KEY);
}

async function fetchWorkoutRecords() {
	return (
		(await LOCAL_STORAGE_MANAGER.fetch.storage(WORKOUT_RECORDS_KEY)) || {}
	);
}

export const LOCAL_STORAGE_MANAGER = {
	fetch: {
		app: {
			date: {
				lastAccessed: lastDateAccessed,
			},
		},
		storage: fetchFromLocalStorage,
		workout: {
			data: fetchWorkoutData,
			day: fetchWorkoutDay,
			records: fetchWorkoutRecords,
		},
		program: fetchCurrentProgram,
	},
	save: saveToLocalStorage,
	remove: removeFromLocalStorage,
};

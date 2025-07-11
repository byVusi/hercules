/**
 * Retrieves all records for a given exercise.
 *
 * @param {string} exerciseName - The name of the exercise to fetch.
 * @param {Object} records - An object containing arrays of performance records keyed by exercise names.
 * @returns {{exercise: string, data: Array<Object>}|undefined} A structured object with exercise name and its data, or undefined if no data exists.
 */
function getAllRecords(exerciseName, records) {
	const exerciseRecords = records?.[exerciseName];

	if (!Array.isArray(exerciseRecords) || exerciseRecords.length === 0) return;

	const structuredRecord = {
		exercise: exerciseName,
		data: [...exerciseRecords],
	};

	return structuredRecord;
}

/**
 * Retrieves the last two records for a given exercise.
 *
 * @param {string} exerciseName - The name of the exercise to fetch.
 * @param {Object} records - An object containing arrays of performance records keyed by exercise names.
 * @returns {{exercise: string, data: Array<Object>}|undefined} A structured object with the last two records, or undefined if not enough data exists.
 */
function getLastTwoRecords(exerciseName, records) {
	if (!records?.[exerciseName] || records[exerciseName].length < 2) return;

	const stats = records[exerciseName];
	const lastTwo = stats.slice(-2); // Safely get the last two entries

	const structuredRecord = {
		exercise: exerciseName,
		data: [...lastTwo],
	};

	return structuredRecord;
}

/**
 * Extracts a numeric property (e.g., weight, reps) from each object in the stats array.
 *
 * @param {Array<Object>} statsArray - An array of record objects.
 * @param {string} [prop="weight"] - The property name to extract.
 * @returns {Array<number>} An array of numeric values.
 */
function fetchRecordData(statsArray = [], prop = "weight") {
	const stats = statsArray?.data.map((stat) => Number(stat[prop]));
	return stats;
}

/**
 * Calculates the absolute change between two numbers.
 *
 * @param {[number, number]} values - An array with exactly two numbers: [previous, current].
 * @returns {number} The difference (current - previous).
 */
function calculateAmountChange([previous, current]) {
	return current - previous;
}

/**
 * Calculates the percentage change between two numbers.
 *
 * @param {[number, number]} values - An array with exactly two numbers: [previous, current].
 * @returns {number} The percentage change, or 0 if previous is zero.
 */
function calcPercentageChange([previous, current]) {
	if (previous === 0) return 0; // Avoid division by zero
	return calculateAmountChange([previous, current]) / previous;
}

export const WORKOUT_STATS = {
	all: getAllRecords,
	penultimate: getLastTwoRecords,
	exerciseData: fetchRecordData,
	change: {
		amount: calculateAmountChange,
		percentage: calcPercentageChange,
	},
};

/**
 * Capitalises the first character of a string after trimming whitespace.
 *
 * @param {string} value - The input string to capitalise.
 * @returns {string} The capitalized string.
 *
 * @example
 * capitalise("  hello") // returns "Hello"
 */
function capitalise(value) {
	const trimmed = value.trim();
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function capitaliseWords(phrase) {
	return phrase
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatRelativeDate(dateString) {
	const date = new Date(dateString);
	const now = new Date();

	const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	if (Math.abs(diffInSeconds) < 60) {
		return rtf.format(Math.round(diffInSeconds), "second");
	} else if (Math.abs(diffInSeconds) < 3600) {
		return rtf.format(Math.round(diffInSeconds / 60), "minute");
	} else if (Math.abs(diffInSeconds) < 86400) {
		return rtf.format(Math.round(diffInSeconds / 3600), "hour");
	} else if (Math.abs(diffInSeconds) < 2592000) {
		// Approx 30 days
		return rtf.format(Math.round(diffInSeconds / 86400), "day");
	} else if (Math.abs(diffInSeconds) < 31536000) {
		// Approx 365 days
		return rtf.format(Math.round(diffInSeconds / 2592000), "month");
	} else {
		return rtf.format(Math.round(diffInSeconds / 31536000), "year");
	}
}

function getTodayString() {
	const today = new Date();
	return `${today.getFullYear()}/${
		today.getMonth() + 1 < 10
			? `0${today.getMonth() + 1}`
			: today.getMonth() + 1
	}/${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`; // Format: YYYY/MM/DD
}

export const UTILITIES = {
	format: {
		text: {
			capitalise: capitalise,
			capitalise_multiple: capitaliseWords,
		},
		date: {
			relative: formatRelativeDate,
			todayString: getTodayString,
		},
	},
};

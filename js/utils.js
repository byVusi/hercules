/**
 * Capitalizes the first character of a string after trimming whitespace.
 *
 * @param {string} value - The input string to capitalize.
 * @returns {string} The capitalized string.
 *
 * @example
 * capitalise("  hello") // returns "Hello"
 */
function capitalise(value) {
	const trimmed = value.trim();
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * A collection of utility functions used throughout the application.
 *
 * @namespace utilities
 * @property {function(string): string} capitalise - Capitalizes the first letter of a trimmed string.
 */
export const utilities = {
	capitalise,
};

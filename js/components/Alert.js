/**
 * Creates a Bootstrap-style alert DOM element with an icon and message.
 *
 * @param {string} text - The message text to display in the alert.
 * @param {'primary' | 'success' | 'danger' | 'warning'} [semantic='primary'] - The semantic type of the alert, which determines its color and icon.
 * @returns {HTMLDivElement} A configured alert element ready to be inserted into the DOM.
 */
function createAlert(text, semantic = "primary", position = "") {
	const div = document.createElement("div");
	div.classList.add("alert", `alert-${semantic}`);
	div.role = "alert";

	div.innerHTML = `<i class="material-icons">${
		semantic === "primary"
			? "info"
			: semantic === "success"
			? "check_circle"
			: semantic === "danger"
			? "error"
			: "warning"
	}</i>${text}
    `;

	if (!position) return div;

	if (position === "floating-alert") {
		div.classList.add(position);
	}

	return div;
}

/**
 * Removes an alert element from a container and re-enables a button inside the container.
 *
 * @param {HTMLElement} container - The container element that holds the alert and button.
 * @param {string} alertClass - The CSS selector string targeting the alert to remove (e.g., '.alert').
 * @returns {void}
 */
function removeAlert(container, alertClass) {
	container.querySelector(alertClass).remove();

	// Enable button
	container.querySelector("button").disabled = false;
}

/**
 * Alert management module for creating and removing alerts in the UI.
 *
 * @namespace alertAction
 * @property {function(string, string=): HTMLDivElement} insertAlert - Function to create a new alert.
 * @property {function(HTMLElement, string): void} removeAlert - Function to remove an alert and re-enable the button.
 */
export const alertAction = {
	insertAlert: createAlert,
	removeAlert: removeAlert,
};

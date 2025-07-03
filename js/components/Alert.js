function createAlert(text, semantic = "primary", position = "") {
	const div = document.createElement("div");
	div.classList.add("alert", `alert-${semantic}`);
	div.role = "alert";
	div.textContent = text;

	const icon = document.createElement("i");
	icon.classList.add("material-icons");
	icon.textContent =
		semantic === "primary"
			? "info"
			: semantic === "success"
			? "check_circle"
			: semantic === "danger"
			? "error"
			: "warning";

	div.prepend(icon);

	if (!position) return div;

	if (position === "floating-alert") {
		div.classList.add(position);
	}

	return div;
}

function removeAlert(container, alertClass) {
	container.querySelector(alertClass).remove();

	// Enable button
	container.querySelector("button").disabled = false;
}

export const ALERT = {
	create: createAlert,
	remove: removeAlert,
};

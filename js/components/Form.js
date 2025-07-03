import { UTILITIES } from "../utils.js";
import { CLICK_HANDLERS } from "../handlers/click.js";

export function createForm(data, index, type = "number") {
	const exercise = data[index];
	const labels = exercise?.recordLabels;

	const form = document.createElement("form");
	form.dataset.exerciseName = exercise?.name;

	labels.forEach((element, index) => {
		form.append(createFormField(element, index, type));
	});

	form.append(
		createFormButton("Save record", CLICK_HANDLERS.save.exerciseRecord)
	);

	return form;
}

function createFormField(data, index, type) {
	const formattedData = UTILITIES.format.text.capitalise(data);
	const label = data !== "weight" ? formattedData : `${formattedData} (kg)`;
	const step = data !== "weight" ? 1 : 0.5;

	const formField = document.createElement("div");
	formField.classList.add("mb-3", "form-field");

	const labelElement = document.createElement("label");
	labelElement.setAttribute("for", `${data}_${index}`);
	labelElement.classList.add("form-label");
	labelElement.setAttribute("data-label-name", data);
	labelElement.textContent = `${label}:`;

	const inputElement = document.createElement("input");
	inputElement.id = `${data}_${index}`;
	inputElement.setAttribute("type", type);
	inputElement.classList.add("form-control");
	inputElement.setAttribute("min", "0");
	inputElement.setAttribute("step", step);

	formField.append(labelElement, inputElement);

	return formField;
}

/**
 * Creates a styled button element and wraps it in a right-aligned container div.
 *
 * @param {string} text - The button's text content.
 * @param {Function} handler - The function to be executed on click.
 * @returns {HTMLDivElement} The container div holding the button.
 */
function createFormButton(text, handler) {
	const div = document.createElement("div");
	div.classList.add("right-align");

	const button = document.createElement("button");
	button.type = "button";
	button.classList.add("btn", "btn-primary");
	button.textContent = text;

	if (typeof handler === "function") {
		button.addEventListener("click", handler);
	}

	div.appendChild(button);
	return div;
}

export const FORM = {
	create: createForm,
};

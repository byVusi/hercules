import { utilities } from "../utils.js";
import { saveExerciseRecord } from "../handlers.js";

/**
 * Creates a form DOM element for recording data for a given exercise.
 * Each field corresponds to a record label (e.g., reps, sets, weight).
 *
 * @param {Array<Object>} data - An array of exercise objects.
 * @param {number} index - The index of the exercise to create the form for.
 * @param {string} data[].name - The name of the exercise.
 * @param {string[]} data[].recordLabels - Labels to use for the input fields.
 * @returns {HTMLFormElement} The fully constructed form element for the given exercise.
 */
export function createForm(data, index) {
	const exercise = data[index];
	const labels = exercise?.recordLabels;

	const form = document.createElement("form");
	form.dataset.exerciseName = exercise?.name;

	labels.forEach((element, index) => {
		form.innerHTML += createFormField(element, index, "number");
	});

	form.append(createFormButton("Save record", saveExerciseRecord));

	return form;
}

/**
 * Creates a single labeled form input field as an HTML string.
 *
 * @param {string} data - The name of the data field (e.g., "reps", "weight").
 * @param {number} index - The index used to uniquely identify the field.
 * @param {string} [type="text"] - The input type for the field (e.g., "number", "text").
 * @returns {string} The HTML string for the labeled form input.
 */
function createFormField(data, index, type = "text") {
	const label =
		data !== "weight"
			? utilities.capitalise(data)
			: `${utilities.capitalise(data)} (kg)`;
	const step = data !== "weight" ? 1 : 0.5;

	return `
    <div class="mb-3 form-field">
        <label for="${data}_${index}" class="form-label" data-label-name="${data}"> ${label}: </label>
        <input type="${type}" class="form-control" id="${data}_${index}" min="0" step="${step}">
    </div>  
    `;
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
	div.className = "right-align";

	const button = document.createElement("button");
	button.type = "button";
	button.className = "btn btn-primary";
	button.textContent = text;

	if (typeof handler === "function") {
		button.addEventListener("click", handler);
	}

	div.appendChild(button);
	return div;
}

import { utilities } from "../utils.js";
import { createForm } from "./Form.js";
import { createPill } from "./List.js";

/**
 * Creates a Bootstrap-styled accordion element based on provided exercise data.
 * Each accordion item includes a title, a collapsible body with a video, notes, and an embedded form.
 *
 * @param {Object} data - The data object containing an array of exercises.
 * @param {Array<Object>} data.exercises - An array of exercise objects.
 * @param {string} data.exercises[].name - The name of the exercise.
 * @param {string} data.exercises[].demo - URL for the demo video.
 * @param {string[]} data.exercises[].equipment - List of equipment names.
 * @param {string} data.exercises[].recommended - Recommended details for the exercise.
 *
 * @returns {HTMLDivElement} The fully constructed accordion DOM element.
 */
export function createAccordion(data) {
	const accordion = document.createElement("div");
	accordion.className = "accordion";
	accordion.id = "accordionExample";

	const exercises = data?.exercises;

	exercises.forEach((exercise, index) => {
		accordion.innerHTML += createAccordionItem(exercise, index);
		accordion.querySelector(`#collapse_${index}`).innerHTML =
			createAccordionBody(exercise);
	});

	const bodies = accordion.querySelectorAll(".accordion-body");

	bodies.forEach((body, index) => {
		body.append(createForm(exercises, index));
	});

	return accordion;
}

export function createExerciseAccordion(programs) {
	const accordion = document.createElement("div");
	accordion.className = "accordion";
	accordion.id = "accordionExample";

	const allExercises = [];

	Object.keys(programs).forEach((program) => {
		const days = programs[program]?.days;

		if (!days) return;

		const exercises = [];
		days.forEach((day) => {
			day?.exercises.forEach((exercise) => {
				exercises.push(exercise);
			});
		});

		// Sort array of objects
		exercises.sort((a, b) => a?.name.localeCompare(b?.name));

		exercises.forEach((exercise) => {
			allExercises.push(exercise);
		});
	});

	allExercises.forEach((exercise, index) => {
		accordion.innerHTML += createAccordionItem(exercise, index);
		accordion.querySelector(`#collapse_${index}`).innerHTML =
			createExerciseAccordionBody(exercise);
	});

	const bodies = accordion.querySelectorAll(".accordion-body");

	// Add pills indicating targeted muscles
	bodies.forEach((body, index) => {
		const muscles = allExercises[index]?.muscleGroups;
		muscles.forEach((muscle) => {
			body.innerHTML += createPill(muscle);
		});
	});

	return accordion;
}

/**
 * Generates the outer HTML string for a single accordion item (excluding inner body content).
 *
 * @param {Object} data - The exercise data object.
 * @param {number} index - The index of the exercise in the list (used to create unique IDs).
 * @returns {string} HTML string for the accordion item.
 */
function createAccordionItem(data, index) {
	const htmlString = `
    <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${index}" aria-expanded="false" aria-controls="collapseThree" data-button-text="${data?.name}">
        ${data?.name}
      </button>
    </h2>
    <div id="collapse_${index}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        This feature is not yet in use.
      </div>
    </div>
    `;

	return htmlString;
}

/**
 * Creates the inner HTML string for the body of an accordion item.
 * Includes a video and formatted notes (equipment list and recommendation).
 *
 * @param {Object} data - The exercise data object.
 * @param {string[]} data.equipment - Array of equipment names.
 * @param {string} data.demo - URL to the demo video.
 * @param {string} data.recommended - Recommended usage or instruction text.
 * @returns {string} HTML string for the accordion body.
 */

function createAccordionBody(data) {
	const equipment = data?.equipment.map((e) => utilities.capitalise(e));
	const restTime = data?.rest
		? `<span>(${data?.rest}s rest between sets)</span>`
		: "";
	
	const htmlString = `
	<div class="accordion-body">
		<iframe src="${
			data?.demo
		}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
	    <div class='exercise-notes'>
	    	<p><strong>Equipment:</strong> ${equipment.join(", ")}</p>
	    	<p><strong>Recommended:</strong> ${data?.recommended}, ${restTime}</p>
		</div>
	</div>
	`;

	return htmlString;
}

/**
 * Toggles a single accordion item's expanded/collapsed state.
 *
 * @param {HTMLElement} item - The DOM element representing the accordion item to toggle.
 * @returns {void}
 */
export function toggleAccordionItem(item) {
	if (!item) return;

	const button = item.querySelector(".accordion-button");
	const accordionCollapse = item.querySelector(".accordion-collapse");

	button.classList.toggle("collapsed");
	button.ariaExpanded
		? (button.ariaExpanded = false)
		: (button.ariaExpanded = true);

	accordionCollapse.classList.toggle("show");
}

function createExerciseAccordionBody(data) {
	const equipment = data?.equipment.map((e) => utilities.capitalise(e));
	const htmlString = `
    <div class="accordion-body">
        <h5 class="pt-3 pb-3">Exercise information</h5>
        <div class='exercise-notes'>
			<p><strong>Category:</strong> ${utilities.capitalise(
				data?.category
			)} Training</p>
			<p><strong>Type:</strong> ${utilities.capitalise(data?.type)} Exercise</p>
			${data?.notes ? `<p><strong>Notes:</strong> ${data?.notes}</p>` : ""}
            <p><strong>Equipment:</strong> ${equipment.join(", ")}</p>
        </div>
    </div>
    `;
	return htmlString;
}

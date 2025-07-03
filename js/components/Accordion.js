import { UTILITIES } from "../utils.js";
import { FORM } from "./Form.js";
import { LIST } from "./List.js";

function createAccordion(data) {
	const accordion = returnAccordion();

	const exercises = data?.exercises;

	exercises.forEach((exercise, index) => {
		accordion.append(createAccordionItem(exercise, index));
		accordion
			.querySelector(`#collapse_${index}`)
			.append(createAccordionBody(exercise));
	});

	const bodies = accordion.querySelectorAll(".accordion-body");

	bodies.forEach((body, index) => {
		body.append(FORM.create(exercises, index));
	});

	return accordion;
}

function createExerciseAccordion(programs) {
	const accordion = returnAccordion();

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
		accordion.append(createAccordionItem(exercise, index));
		accordion
			.querySelector(`#collapse_${index}`)
			.append(createExerciseAccordionBody(exercise));
	});

	const bodies = accordion.querySelectorAll(".accordion-body");

	// Add pills indicating targeted muscles
	bodies.forEach((body, index) => {
		const muscles = allExercises[index]?.muscleGroups;
		muscles.forEach((muscle) => {
			body.append(LIST.create.pills(muscle));
		});
	});

	return accordion;
}

function createAccordionItem(data, index) {
	const accordionItem = document.createElement("div");
	accordionItem.classList.add("accordion-item");

	const accordionHeader = document.createElement("h2");
	accordionHeader.classList.add("accordion-header");

	const accordionButton = document.createElement("button");
	accordionButton.classList.add("accordion-button", "collapsed");
	accordionButton.type = "button";
	accordionButton.setAttribute("data-bs-toggle", "collapse");
	accordionButton.setAttribute("data-bs-target", `#collapse_${index}`);
	accordionButton.setAttribute("aria-expanded", "false");
	accordionButton.setAttribute("aria-controls", `collapse_${index}`);
	accordionButton.setAttribute("data-button-text", data?.name);
	accordionButton.textContent = data?.name;

	accordionHeader.appendChild(accordionButton);
	accordionItem.appendChild(accordionHeader);

	const accordionCollapse = document.createElement("div");
	accordionCollapse.id = `collapse_${index}`;
	accordionCollapse.classList.add("accordion-collapse", "collapse");
	accordionCollapse.setAttribute("data-bs-parent", "#accordionExample");

	accordionItem.appendChild(accordionCollapse);

	return accordionItem;
}

function createAccordionBody(data) {
	const equipment = data?.equipment.map((e) =>
		UTILITIES.format.text.capitalise(e)
	);

	const body = document.createElement("div");
	body.classList.add("accordion-body");

	const iframe = document.createElement("iframe");
	iframe.loading = "lazy";
	iframe.src = data?.demo;
	iframe.title = "YouTube video player";
	iframe.frameBorder = "0";
	iframe.allow =
		"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
	iframe.referrerPolicy = "strict-origin-when-cross-origin";
	iframe.allowFullscreen = true;

	const exerciseNotes = document.createElement("div");
	exerciseNotes.classList.add("exercise-notes");

	const equipmentParagraph = document.createElement("p");
	equipmentParagraph.textContent = equipment.join(", ");
	const equipmentParagraphStrong = document.createElement("strong");
	equipmentParagraphStrong.textContent = "Equipment: ";
	equipmentParagraph.prepend(equipmentParagraphStrong);

	const recommendationParagraph = document.createElement("p");
	recommendationParagraph.textContent = `${data?.recommended}, `;
	const restTimeSpan = document.createElement("span");
	restTimeSpan.textContent = data?.rest
		? `(${data?.rest}s rest between sets)`
		: "";
	recommendationParagraph.append(restTimeSpan);

	const recommendationParagraphStrong = document.createElement("strong");
	recommendationParagraphStrong.textContent = "Recommended: ";
	recommendationParagraph.prepend(recommendationParagraphStrong);

	exerciseNotes.append(equipmentParagraph, recommendationParagraph);
	body.append(iframe, exerciseNotes);

	return body;
}

function toggleAccordionItem(item) {
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
	const equipment = data?.equipment.map((e) =>
		UTILITIES.format.text.capitalise(e)
	);

	const body = document.createElement("div");
	body.classList.add("accordion-body");

	const header = document.createElement("h5");
	header.classList.add("pt-3", "pb-3");
	header.textContent = "Exercise information";

	const exerciseNotes = document.createElement("div");
	exerciseNotes.classList.add("exercise-notes", "pb-3");

	const categoryParagraph = document.createElement("p");
	categoryParagraph.textContent = `${UTILITIES.format.text.capitalise(
		data?.category
	)} Training`;
	const categoryParagraphStrong = document.createElement("strong");
	categoryParagraphStrong.textContent = "Category: ";
	categoryParagraph.prepend(categoryParagraphStrong);

	const typeParagraph = document.createElement("p");
	typeParagraph.textContent = `${UTILITIES.format.text.capitalise(
		data?.type
	)} Exercise`;
	const typeParagraphStrong = document.createElement("strong");
	typeParagraphStrong.textContent = "Type: ";
	typeParagraph.prepend(typeParagraphStrong);

	const notesParagraph = document.createElement("p");
	if (data?.notes) {
		notesParagraph.textContent = data?.notes;
		const notesParagraphStrong = document.createElement("strong");
		notesParagraphStrong.textContent = "Notes: ";
		notesParagraph.prepend(notesParagraphStrong);
	}

	const equipmentParagraph = document.createElement("p");
	equipmentParagraph.textContent = equipment.join(", ");
	const equipmentParagraphStrong = document.createElement("strong");
	equipmentParagraphStrong.textContent = "Equipment: ";
	equipmentParagraph.prepend(equipmentParagraphStrong);

	if (data?.notes) {
		exerciseNotes.append(
			categoryParagraph,
			typeParagraph,
			notesParagraph,
			equipmentParagraph
		);
	} else {
		exerciseNotes.append(
			categoryParagraph,
			typeParagraph,
			equipmentParagraph
		);
	}

	body.append(header, exerciseNotes);

	return body;
}

function returnAccordion() {
	const accordion = document.createElement("div");
	accordion.classList.add("accordion");
	accordion.id = "accordionExample";

	return accordion;
}

export const ACCORDION = {
	create: {
		default: createAccordion,
		exercise: createExerciseAccordion,
	},
	toggle: {
		item: toggleAccordionItem,
	},
};

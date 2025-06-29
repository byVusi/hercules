import { appData } from "../assets/data/js/fetchAppData.js";
import { localStorageManager } from "./managers/localStorageManager.js";
import {
	createAccordion,
	createExerciseAccordion,
} from "./components/Accordion.js";
import { createListOfCards, createPill } from "./components/List.js";

const programs = await appData.workoutPrograms();
const workout = await localStorageManager.fetchWorkout();

const placeholderImageUrl =
	"https://cdn-icons-png.flaticon.com/512/404/404723.png";

/**
 * Builds and displays the "Today" view by injecting workout content into the DOM.
 * Adds a wrapper class and replaces children of the `.today-content` element.
 *
 * @returns {void}
 */
function createTodayView() {
	const element = document.querySelector(".today-content");
	element.classList.add("wrapper");
	element.replaceChildren();

	// Workout title
	const description = document.createElement("div");
	description.innerHTML = `
	<h2>${workout?.title}</h2>
	`;
	element.append(description, createAccordion(workout));
}

async function createWorkoutsView() {
	const element = document.querySelector(".workouts-content");
	element.classList.add("wrapper");
	element.replaceChildren();

	element.append(createListOfCards(programs));

	const programName = await localStorageManager.fetchCurrentProgram();

	if (!programName) return;

	const cards = document.querySelectorAll("#program-list .card");

	if (cards.length !== 0) {
		cards.forEach((card) => {
			const title = card.querySelector(".card-title").textContent;

			if (title === programs[programName]?.title) {
				card.querySelector(".card-body").innerHTML +=
					createPill("Active");
			}
		});
	}
}

function createExercisesView() {
	const element = document.querySelector(".exercises-content");
	element.classList.add("wrapper");
	element.replaceChildren();

	element.append(createExerciseAccordion(programs));
}

async function createProgressView() {
	const element = document.querySelector(".progress-content");
	element.classList.add("wrapper");
	element.replaceChildren();

	const storedKey = `hercules_workout_records`;
	const records = await localStorageManager.fetch(storedKey);

	if (!records) {
		element.append(
			createPlaceholderImage(placeholderImageUrl),
			createPlaceholderText("Not enough data available yet")
		);
		return;
	}

	const exercises = Object.keys(records);
}

/**
 * Handles transitioning between views with directional slide animation.
 * Applies relevant classes for in/out animation and updates active view index.
 *
 * @param {HTMLElement[]} views - An array of view elements (divs with class `.view`).
 * @param {{ current: number }} state - Object tracking the currently active view index.
 * @param {number} newIndex - Index of the view to display next.
 * @returns {void}
 */
function showView(views, state, newIndex) {
	const direction = newIndex > state.current ? "left" : "right";
	const currentView = views[state.current];
	const nextView = views[newIndex];

	// Reset classes
	views.forEach((v) =>
		v.classList.remove("active", "slide-left", "slide-right")
	);

	// Position next view off-screen in the right direction
	nextView.classList.add(`slide-${direction === "left" ? "right" : "left"}`);

	// Force reflow to apply the initial position
	void nextView.offsetWidth;

	// Animate transition
	currentView.classList.add(`slide-${direction}`);
	nextView.classList.remove(
		`slide-${direction === "left" ? "right" : "left"}`
	);
	nextView.classList.add("active");

	state.current = newIndex;
	updateNavUI(newIndex);
}

/**
 * Updates the navigation UI to reflect the currently active view.
 * Also calls the associated view render function based on index.
 *
 * @param {number} index - The index of the current view (0–3).
 * @returns {void}
 */
function updateNavUI(index) {
	document.querySelectorAll("nav li").forEach((li, i) => {
		li.querySelector("div").classList.toggle("active", i === index);
	});

	if (index >= 0 && index < viewStrings.length)
		appViews[viewStrings[index]]();
}

const viewStrings = ["today", "workouts", "exercises", "progress"];

/**
 * Maps view names to their rendering functions and exposes navigation controller.
 *
 * @namespace appViews
 * @property {function(): void} today - Renders the Today view.
 * @property {function(): void} workouts - Renders the Workouts view.
 * @property {function(): void} exercises - Renders the Exercises view.
 * @property {function(): void} progress - Renders the Progress view.
 * @property {function(HTMLElement[], {current: number}, number): void} showView - Manages animated transitions between views.
 */
export const appViews = {
	today: createTodayView,
	workouts: createWorkoutsView,
	exercises: createExercisesView,
	progress: createProgressView,
	showView: showView,
};

function createPlaceholderText(text = "This is placeholder text") {
	const placeholder = document.createElement("p");
	placeholder.textContent = text;
	placeholder.classList.add("placeholder-text");
	return placeholder;
}

function createPlaceholderImage(url) {
	const image = document.createElement("img");
	image.src = url;
	image.classList.add("placeholder-image");
	return image;
}

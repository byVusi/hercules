import { APP_DATA } from "../assets/data/js/fetchAppData.js";
import { LOCAL_STORAGE_MANAGER } from "./managers/localStorageManager.js";
import { ACCORDION } from "./components/Accordion.js";
import { LIST } from "./components/List.js";
import { CARD } from "./components/Card.js";

const APP_NAME = (await APP_DATA.manifest())?.name.trim().toLowerCase();
const PROGRAMS = await APP_DATA.programs();
const WORKOUT_RECORDS_KEY = `${APP_NAME}_workout_records`;

const WORKOUT = await LOCAL_STORAGE_MANAGER.fetch.workout.data();

const viewStrings = ["today", "workouts", "exercises", "progress"];
const placeholderImageUrl =
	"https://cdn-icons-png.flaticon.com/512/404/404723.png";

/**
 * Builds and displays the "Today" view by injecting workout content into the DOM.
 * Adds a wrapper class and replaces children of the `.today-content` element.
 *
 * @returns {void}
 */
function createTodayView() {
	const element = returnElement("today-content");

	const description = document.createElement("div");
	const heading = document.createElement("h2");
	heading.textContent = WORKOUT?.title;

	description.append(heading);
	element.append(description, ACCORDION.create.default(WORKOUT));
}

async function createWorkoutsView() {
	const element = returnElement("workouts-content");
	element.append(LIST.create.cards(PROGRAMS));

	const programName = await LOCAL_STORAGE_MANAGER.fetch.program();

	if (!programName) return;

	const cards = document.querySelectorAll("#program-list .card");

	if (cards.length !== 0) {
		cards.forEach((card) => {
			const title = card.querySelector(".card-title").textContent;

			if (title === PROGRAMS[programName]?.title) {
				card.querySelector(".card-body").append(
					LIST.create.pills("Active")
				);
			}
		});
	}
}

function createExercisesView() {
	const element = returnElement("exercises-content");
	element.append(ACCORDION.create.exercise(PROGRAMS));
}

async function createProgressView() {
	const element = returnElement("progress-content");
	const records = await LOCAL_STORAGE_MANAGER.fetch.storage(
		WORKOUT_RECORDS_KEY
	);

	if (!records) {
		element.append(
			createPlaceholderImage(placeholderImageUrl),
			createPlaceholderText("Not enough data available yet")
		);
		return;
	}

	const exercises = Object.keys(records);

	if (exercises.length === 0) {
		element.append(
			createPlaceholderImage(placeholderImageUrl),
			createPlaceholderText("No exercises recorded yet")
		);
		return;
	}

	const todayElement = document.createElement("div");
	todayElement.classList.add("today-progress");

	for (const exercise of exercises) {
		const card = CARD.create.progress.exercise(exercise, records, "weight");
		if (card) todayElement.append(card);
	}

	const heading = document.createElement("h2");
	heading.textContent = "Today's Progress";

	element.append(heading, todayElement);
}

function returnElement(className) {
	const element = document.querySelector(`.${className}`);
	element.classList.add("wrapper");
	element.replaceChildren();
	return element;
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
	if (newIndex === state.current) {
		// Already on this view, no need to do anything
		return;
	}
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
		APP_VIEWS[viewStrings[index]]();
}

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

/**
 * Maps view names to their rendering functions and exposes navigation controller.
 *
 * @namespace APP_VIEWS
 * @property {function(): void} today - Renders the Today view.
 * @property {function(): void} workouts - Renders the Workouts view.
 * @property {function(): void} exercises - Renders the Exercises view.
 * @property {function(): void} progress - Renders the Progress view.
 * @property {function(HTMLElement[], {current: number}, number): void} show - Manages animated transitions between views.
 */
export const APP_VIEWS = {
	today: createTodayView,
	workouts: createWorkoutsView,
	exercises: createExercisesView,
	progress: createProgressView,
	show: showView,
};

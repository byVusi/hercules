import { appData } from "../assets/data/js/fetchAppData.js";
import {
	localStorageManager,
	getTodayString,
	lastDateAccessed,
} from "./managers/localStorageManager.js";
import { alertAction } from "./components/Alert.js";
import { toggleAccordionItem } from "./components/Accordion.js";

const manifest = await appData.manifest();
const APP_NAME = manifest.name.toLowerCase();

/**
 * Handles saving an exercise record from a form submission.
 * Validates form inputs, updates local storage, manages UI alerts,
 * and toggles the accordion to the next item.
 *
 * @param {Event} e - The event triggered by clicking the "Save record" button.
 * @returns {Promise<void>}
 */
export async function saveExerciseRecord(e) {
	try {
		const form = e.target.closest("form");
		const NUMBER_OF_INPUTS = Array.from(form.children).length - 1; //Subtract one because of button

		// Get name of selected exercise
		const exerciseName = form.dataset.exerciseName.trim();
		const formattedExerciseName = exerciseName
			.replaceAll(" ", "_")
			.toLowerCase();

		const inputs = form.querySelectorAll(".form-control");
		const record = parseInputValues(inputs);

		const storedKey = `${APP_NAME}_workout_records`;
		let data;

		try {
			data = await localStorageManager.fetch(storedKey);
		} catch (err) {
			console.error(`Failed to fetch ${storedKey}:`, err);
		}

		if (!data) {
			data = {};
			await localStorageManager.save(storedKey, data);
		}

		if (!data[formattedExerciseName]) {
			data[formattedExerciseName] = [];
		}

		const accordionItem = form.closest(".accordion-item");
		const nextAccordionItem = accordionItem?.nextElementSibling;

		if (Object.keys(record).length === NUMBER_OF_INPUTS) {
			record["date"] = new Date().toISOString();
			data[formattedExerciseName].push(record);

			try {
				await localStorageManager.save(storedKey, data);
			} catch (err) {
				console.error(`Failed to save ${storedKey}:`, err);
				showAlert(form, "Error saving record.", "danger");
				return;
			}

			// Reset form and show success
			for (const input of inputs) {
				input.value = "";
			}

			showAlert(form, "Record successfully saved.");
			setTimeout(() => {
				colourCompletedWorkout(exerciseName);
			}, 2600);
			setTimeout(() => {
				toggleAccordionItem(accordionItem);
			}, 2600);
			setTimeout(() => {
				toggleAccordionItem(nextAccordionItem);
			}, 2700);

			await trackCompletedItems(exerciseName);
			setTimeout(async () => {
				await communicateWorkoutCompletion();
			}, 2700);
		} else {
			// UI Component to show that data is not saved
			showAlert(form, "Record not saved. Complete the form.", "danger");
		}

		// Disable button
		form.querySelector("button").disabled = true;

		setTimeout(() => {
			alertAction.removeAlert(form, ".alert");
		}, 2500);
	} catch (err) {
		console.error("Unexpected error in saveExerciseRecord:", err);
		const form = e.target.closest("form");
		if (form) {
			showAlert(
				form,
				"Something went wrong. Please try again.",
				"danger"
			);
		}
	}
}

/**
 * Parses user input fields into a structured object for saving.
 * Only includes numeric values with non-empty inputs.
 *
 * @param {NodeListOf<HTMLInputElement>} inputs - The list of input fields to process.
 * @returns {Object<string, string>} A key-value record of form inputs.
 */
function parseInputValues(inputs) {
	const record = {};

	for (const input of inputs) {
		const key = input.parentNode.querySelector("label").dataset.labelName;
		const value = input.value;

		if (value.trim() !== "" && !isNaN(Number(value))) {
			record[key] = value;
		}
	}

	return record;
}

/**
 * Applies a visual style to the header of a completed exercise.
 *
 * @param {string} exerciseName - The original (non-formatted) name of the exercise.
 * @returns {void}
 */
function colourCompletedWorkout(exerciseName) {
	const heading = document.querySelector(
		`[data-button-text="${exerciseName}"]`
	);

	if (!heading) return;

	heading.classList.add("workout-completed");
}

/**
 * On page load, styles headings for all exercises completed today.
 * Uses localStorage data to determine which exercises are marked as complete.
 *
 * @returns {Promise<void>}
 */
export async function colourCompletedWorkoutsOnReload() {
	const headings = document.querySelectorAll("[data-button-text]");
	const storedKey = `${APP_NAME}_completed_items`;

	if (headings.length === 0) return;

	const completedItems = await localStorageManager.fetch(storedKey);

	if (!completedItems) return;

	// Style based on the day's completed exercises
	for (let i = 0; i < Array.from(headings).length; i++) {
		for (let j = 0; j < completedItems.length; j++) {
			if (completedItems[j] === headings[i].dataset.buttonText) {
				headings[i].classList.add("workout-completed");
			}
		}
	}
}

/**
 * Tracks which exercises have been completed today.
 * Creates or updates a localStorage array keyed by date.
 *
 * @param {string} exerciseName - The name of the completed exercise.
 * @returns {Promise<string[]>} An array of completed exercise names.
 */
async function trackCompletedItems(exerciseName) {
	const storedKey = `${APP_NAME}_completed_items`;

	const previousDay = await lastDateAccessed();
	const today = getTodayString();

	let raw = await localStorageManager.fetch(storedKey);
	let data = Array.isArray(raw) ? [...raw] : [];

	if (previousDay !== today || data.length === 0) {
		data = [exerciseName];
	} else {
		if (!data.includes(exerciseName)) data.push(exerciseName);
	}

	await localStorageManager.save(storedKey, data);
	return data;
}

/**
 * Inserts an alert message into a given container element.
 *
 * @param {HTMLElement} container - The container in which to insert the alert.
 * @param {string} message - The message text to display.
 * @param {'success' | 'danger' | 'warning' | 'primary'} [type='success'] - The semantic type of alert.
 * @returns {void}
 */
function showAlert(container, message, type = "success") {
	container.append(alertAction.insertAlert(message, type));
}

/**
 * Checks whether all workouts have been completed for the current day
 * and shows a celebratory alert if so.
 *
 * - Fetches completed workout records from localStorage.
 * - Compares the number of completed items to the number of workout buttons in the DOM.
 * - Triggers a browser alert if all workouts are complete.
 *
 * @async
 * @function communicateWorkoutCompletion
 * @returns {Promise<void>}
 *
 * @example
 * await communicateWorkoutCompletion();
 */
async function communicateWorkoutCompletion() {
	let data;
	const storedKey = `${APP_NAME}_completed_items`;
	const workouts = Array.from(
		document.querySelectorAll("[data-button-text]")
	);

	const numberOfWorkouts = workouts.length;

	if (!numberOfWorkouts) return;

	try {
		data = await localStorageManager.fetch(storedKey);
		const numberOfCompletedItems = data.length;

		if (numberOfWorkouts === numberOfCompletedItems) {
			window.alert(
				"🎉 Congratulations! You have completed your workouts for today."
			);
		}
	} catch (err) {
		console.error(`Something went wrong with ${data}`, err);
	}
}

/**
 * Handles the event when a program card is clicked.
 *
 * This function:
 * - Identifies the clicked `.card` element.
 * - Retrieves the program key from the card's `data-program-key` attribute.
 * - Saves the program key to localStorage under a constructed key based on the app name.
 * - Displays a success alert indicating the program was selected.
 * - Removes the alert after 2.5 seconds.
 * - Reloads the page after 2.5 seconds to reflect the selected program.
 *
 * @async
 * @function clickOnProgramCard
 * @param {MouseEvent} e - The click event triggered by the user.
 * @returns {Promise<void>} Resolves once the program key is saved, alert is shown, and the page is reloaded.
 */
export async function clickOnProgramCard(e) {
	const card = e.target.closest(".card");

	if (!card) return;

	const programKey = card.dataset.programKey;
	const storedKey = `${APP_NAME}_current_program`;
	const storedValue = await localStorageManager.fetch(storedKey);

	if (!storedValue || storedValue === programKey) return;

	await localStorageManager.save(storedKey, programKey);

	const container = document.querySelector(".workouts-content");

	document.body.append(
		alertAction.insertAlert(
			"New program has been successfully selected",
			"success",
			"floating-alert"
		)
	);

	setTimeout(() => {
		document.querySelector(".alert").remove();
	}, 2500);
	setTimeout(() => {
		window.location.reload();
	}, 2500);
}

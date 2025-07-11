import { CONSTANTS } from "../constants.js";
import { LOCAL_STORAGE_MANAGER } from "../managers/localStorageManager.js";
import { ALERT } from "../components/Alert.js";
import { ACCORDION } from "../components/Accordion.js";
import { UTILITIES } from "../utils.js";
import { APP_VIEWS } from "../applicationViews.js";

const APP_NAME = CONSTANTS?.APP_NAME;
const WORKOUT_RECORDS_KEY = `${APP_NAME}_workout_records`;
const COMPLETED_ITEMS_KEY = `${APP_NAME}_completed_items`;
const CURRENT_PROGRAM_KEY = `${APP_NAME}_current_program`;

const WORKOUT_COMPLETED_CLASS = "workout-completed";
const DATA_BUTTON_TEXT = "[data-button-text]";

async function saveExerciseRecord(e) {
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

		let data;

		try {
			data = await LOCAL_STORAGE_MANAGER.fetch.storage(
				WORKOUT_RECORDS_KEY
			);
		} catch (err) {
			console.error(`Failed to fetch ${WORKOUT_RECORDS_KEY}:`, err);
		}

		if (!data) {
			data = {};
			await LOCAL_STORAGE_MANAGER.save(WORKOUT_RECORDS_KEY, data);
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
				await LOCAL_STORAGE_MANAGER.save(WORKOUT_RECORDS_KEY, data);
			} catch (err) {
				console.error(`Failed to save ${WORKOUT_RECORDS_KEY}:`, err);
				showAlert(form, "Error saving record.", "danger");
				return;
			}

			// Reset form and show success
			for (const input of inputs) {
				input.value = "";
			}

			showAlert(form, "Exercise record has been successfully saved.");
			setTimeout(() => {
				colourCompletedWorkout(exerciseName);
			}, 2600);
			setTimeout(() => {
				ACCORDION.toggle.item(accordionItem);
			}, 2600);
			setTimeout(() => {
				ACCORDION.toggle.item(nextAccordionItem);
			}, 2700);

			await trackCompletedItems(exerciseName);
			setTimeout(async () => {
				await communicateWorkoutCompletion();
			}, 2700);
		} else {
			// UI Component to show that data is not saved
			showAlert(
				form,
				"Record has not been saved. Incomplete form submission.",
				"danger"
			);
		}

		// Disable button
		form.querySelector("button").disabled = true;

		setTimeout(() => {
			ALERT.remove(form, ".alert");
		}, 2500);
	} catch (err) {
		console.error("Unexpected error in saveExerciseRecord:", err);
		const form = e.target.closest("form");
		if (form) {
			showAlert(
				form,
				"Oops! Something went wrong. Please try again.",
				"danger"
			);
		}
	}
}

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

function colourCompletedWorkout(exerciseName) {
	const heading = document.querySelector(
		`[data-button-text="${exerciseName}"]`
	);

	if (!heading) return;

	heading.classList.add(WORKOUT_COMPLETED_CLASS);
}

async function trackCompletedItems(exerciseName) {
	const previousDay =
		await LOCAL_STORAGE_MANAGER.fetch.app.date.lastAccessed();
	const todayString = UTILITIES.format.date.todayString();

	let raw = await LOCAL_STORAGE_MANAGER.fetch.storage(COMPLETED_ITEMS_KEY);
	let data = Array.isArray(raw) ? [...raw] : [];

	if (previousDay !== todayString || data.length === 0) {
		data = [exerciseName];
	} else {
		if (!data.includes(exerciseName)) data.push(exerciseName);
	}

	await LOCAL_STORAGE_MANAGER.save(COMPLETED_ITEMS_KEY, data);
	return data;
}

function showAlert(container, message, type = "success") {
	container.append(ALERT.create(message, type));
}

async function communicateWorkoutCompletion() {
	let data;
	const workouts = Array.from(document.querySelectorAll(DATA_BUTTON_TEXT));

	if (!workouts || workouts.length === 0) return;

	try {
		data = await LOCAL_STORAGE_MANAGER.fetch.storage(COMPLETED_ITEMS_KEY);

		if (workouts.length === data.length) {
			window.alert(
				"🎉 Congratulations! You have completed your workout for today."
			);
		}
	} catch (err) {
		console.error(`Something went wrong with ${data}`, err);
	}
}

async function clickOnProgramCard(e) {
	const card = e.target.closest(".card");

	if (!card) return;

	const programKey = card.dataset.programKey;
	const storedValue = await LOCAL_STORAGE_MANAGER.fetch.storage(
		CURRENT_PROGRAM_KEY
	);

	if (!storedValue || storedValue === programKey) return;

	await LOCAL_STORAGE_MANAGER.save(CURRENT_PROGRAM_KEY, programKey);

	document.body.append(
		ALERT.create(
			"You have successfully selected a new workout program.",
			"success",
			"floating-alert"
		)
	);

	setTimeout(() => {
		ALERT.remove(document, ".alert");
	}, 2500);
	setTimeout(() => {
		window.location.reload();
	}, 2500);
}

function clickNavigation(views, state) {
	document.querySelectorAll("nav li").forEach((li, index) => {
		li.addEventListener("click", () => APP_VIEWS.show(views, state, index));
	});
}

export const CLICK_HANDLERS = {
	save: {
		exerciseRecord: saveExerciseRecord,
		activeProgram: clickOnProgramCard,
	},
	navigation: clickNavigation,
};

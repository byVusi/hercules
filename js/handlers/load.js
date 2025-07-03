import { LOCAL_STORAGE_MANAGER } from "../managers/localStorageManager.js";
import { CONSTANTS } from "../constants.js";

const APP_NAME = CONSTANTS?.APP_NAME;
const COMPLETED_ITEMS_KEY = `${APP_NAME}_completed_items`;

const WORKOUT_COMPLETED_CLASS = "workout-completed";
const DATA_BUTTON_TEXT = "[data-button-text]";

async function colourCompletedWorkoutsOnReload() {
	const headings = document.querySelectorAll(DATA_BUTTON_TEXT);

	if (headings.length === 0) return;

	const completedItems = await LOCAL_STORAGE_MANAGER.fetch.storage(
		COMPLETED_ITEMS_KEY
	);

	if (!completedItems) return;

	// Style based on the day's completed exercises
	const headingsLength = Array.from(headings).length;
	for (let i = 0; i < headingsLength; i++) {
		const itemsLength = completedItems.length;
		for (let j = 0; j < itemsLength; j++) {
			if (completedItems[j] === headings[i].dataset.buttonText) {
				headings[i].classList.add(WORKOUT_COMPLETED_CLASS);
			}
		}
	}
}

export const LOAD_HANDLERS = {
	completedWorkouts: colourCompletedWorkoutsOnReload,
};

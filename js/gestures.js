import { appViews } from "./views.js";

/**
 * Enables swipe navigation on a container element.
 *
 * @param {HTMLElement} container - The DOM element that listens for touch gestures.
 * @param {Array<HTMLElement>} views - Array of view elements to navigate between.
 * @param {{ current: number }} state - An object representing the current view index.
 *
 * @description
 * Listens for horizontal swipe gestures (`touchstart` and `touchend`) and updates the
 * current view if the swipe distance exceeds 50 pixels. It prevents going beyond the
 * first and last view.
 */
function swipeNavigation(container, views, state) {
	let startX = 0;
	container.addEventListener("touchstart", (e) => {
		startX = e.touches[0].clientX;
	});

	container.addEventListener("touchend", (e) => {
		const endX = e.changedTouches[0].clientX;
		const deltaX = endX - startX;

		if (Math.abs(deltaX) > 50) {
			let newIndex = state.current;

			if (deltaX < 0 && state.current < views.length - 1) {
				newIndex++;
			} else if (deltaX > 0 && state.current > 0) {
				newIndex--;
			}

			if (newIndex !== state.current) {
				appViews.showView(views, state, newIndex);
			}
		}
	});
}

/**
 * Enables click-based navigation via navigation list items (`<nav><li>`).
 *
 * @param {Array<HTMLElement>} views - Array of view elements to navigate between.
 * @param {{ current: number }} state - An object representing the current view index.
 *
 * @description
 * Attaches a click event listener to each `<li>` inside a `<nav>` element.
 * When clicked, it changes the current view to the clicked index.
 */
function clickNavigation(views, state) {
	document.querySelectorAll("nav li").forEach((li, index) => {
		li.addEventListener("click", () =>
			appViews.showView(views, state, index)
		);
	});
}

/**
 * A collection of gesture-based navigation handlers.
 *
 * @typedef {Object} Gestures
 * @property {Function} swipe - Function to initialize swipe navigation.
 * @property {Function} click - Function to initialize click navigation.
 */

/**
 * Exported gesture handlers for use in navigation.
 * @type {Gestures}
 */
export const gestures = {
	swipe: swipeNavigation,
	click: clickNavigation,
};

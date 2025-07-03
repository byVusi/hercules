import { APP_DATA } from "../assets/data/js/fetchAppData.js";
import { CLICK_HANDLERS } from "../js/handlers/click.js";

const MANIFEST = await APP_DATA.manifest();
/**
 * Initialises navigation controls for the application.
 * Enables swipe and click navigation between views using gesture handlers.
 *
 * Uses a shared state object to track the currently active view.
 *
 * @returns {void}
 */
function initialiseNavigationControls() {
	const STATE = { current: 0 };
	const views = Array.from(document.querySelectorAll(".view"));
	CLICK_HANDLERS.navigation(views, STATE);
}

/**
 * Asynchronously initializes the HTML document with meta information
 * and application name from the manifest data.
 *
 * @returns {Promise<void>} Resolves when all metadata initialization is complete.
 */
async function initialiseHTML() {
	initialiseMetaDescription(MANIFEST?.description);
	initialiseDocumentTitle(MANIFEST?.name);
	initialiseAppName(MANIFEST?.name);
}

/**
 * Sets the document's meta description tag content.
 * Creates the tag if it does not already exist.
 *
 * @param {string} [value="Page description goes here"] - The description content to set.
 * @returns {void}
 */
function initialiseMetaDescription(value = "Page description goes here") {
	const descriptionContentAttr = document.querySelector(
		"meta[name='description']"
	);

	if (!descriptionContentAttr) {
		console.warn(
			'<meta name="description"/> does not exist. Initializing meta tag...'
		);
		const metaTag = document.createElement('meta[name="description"]');
		metaTag.content = value;
		document
			.querySelector('meta[name="viewport"]')
			.insertAdjacentElement("afterend", metaTag);
		return;
	}

	descriptionContentAttr.content = value;
}

/**
 * Sets or creates the document `<title>` tag with the provided value.
 *
 * @param {string} [value="Document title goes here."] - The title text for the document.
 * @returns {void}
 */
function initialiseDocumentTitle(value = "Document title goes here.") {
	const documentTitleTag = document.querySelector("title");

	if (!documentTitleTag) {
		console.warn("<title /> does not exist. Initializing title tag...");
		const titleTag = document.createElement("title");
		titleTag.textContent = value;
		document
			.querySelector('link[href="/css/style.css"]')
			.insertAdjacentElement("afterend", titleTag);
		return;
	}

	documentTitleTag.textContent = value;
}

/**
 * Updates all DOM elements with class `.app-name` to reflect the application name.
 *
 * @param {string} [value="App name goes here."] - The application name to display.
 * @returns {void}
 */
function initialiseAppName(value = "App name goes here.") {
	const appNameElements = document.querySelectorAll(".app-name");

	if (appNameElements.length === 0) {
		console.warn(" className = 'app-name' does not exist. ");
		return;
	}

	Array.from(appNameElements).forEach((element) => {
		element.textContent = value;
	});
}

/**
 * Provides methods for initializing key parts of the HTML application shell.
 *
 * @namespace initialise
 * @property {function(): Promise<void>} htmlDocument - Initializes metadata and branding based on the manifest.
 * @property {function(): void} navigation - Sets up gesture-based navigation.
 */
export const INIT = {
	document: initialiseHTML,
	navigation: initialiseNavigationControls,
};

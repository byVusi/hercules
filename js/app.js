const SW_VERSION = "Hercules-v2";
const SW_VERSION_KEY = "sw-version";

if ("serviceWorker" in navigator) {
	const previousVersion = localStorage.getItem(SW_VERSION_KEY);

	if (previousVersion !== SW_VERSION) {
		// Unregister old service workers
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			return Promise.all(
				registrations.map((reg) => {
					console.log(`Unregistering old SW at: ${reg.scope}`);
					return reg.unregister();
				})
			);
		}).then(() => {
			// Register new service worker
			navigator.serviceWorker
				.register("../sw.js")
				.then(() => {
					console.log(`✅ Registered Service Worker for ${SW_VERSION}`);
					localStorage.setItem(SW_VERSION_KEY, SW_VERSION);
				})
				.catch((err) =>
					console.error("❌ Service Worker failed:", err)
				);
		});
	} else {
		// Version unchanged, ensure still registered
		navigator.serviceWorker
			.register("../sw.js")
			.then(() => console.log(`✅ Service Worker confirmed for ${SW_VERSION}`))
			.catch((err) =>
				console.error("❌ Service Worker failed:", err)
			);
	}
}


import { initialise } from "./dom.js";
import { appViews } from "./views.js";
import { colourCompletedWorkoutsOnReload } from "./handlers.js";

// App initialisation
await initialise.htmlDocument();
initialise.navigation();

// Display today view
appViews.today();

//Keep track of completed items from localStorage
await colourCompletedWorkoutsOnReload();

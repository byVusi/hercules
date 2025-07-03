if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("./service-worker.js")
		.then(() => console.log("✅ Service Worker registered"))
		.catch((err) => console.error("❌ Service Worker failed:", err));
}

import { INIT } from "./init.js";
import { APP_VIEWS } from "./applicationViews.js";
import { LOAD_HANDLERS } from "./handlers/load.js";

// App initialisation
await INIT.document();
INIT.navigation();

// Display today view
APP_VIEWS.today();

//Keep track of completed items from localStorage
await LOAD_HANDLERS.completedWorkouts();

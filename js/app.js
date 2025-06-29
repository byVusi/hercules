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

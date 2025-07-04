# Hercules

Hercules is a modern, offline-capable Progressive Web App (PWA) designed to help users easily follow and track their workouts. It focuses on clean data management, robust localStorage handling, and intuitive workout progression.

---

## Table of Contents

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [Workout Programs](#workout-programs)
-   [Data Fetching](#data-fetching)
-   [Local Storage Management](#local-storage-management)
-   [Getting Started](#getting-started)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)

## Project Overview

Hercules provides users with a structured rotating workout cycles targeting different muscle groups with compound and isolation exercises. The app is designed to work offline with data persistence using localStorage, and offers video demos, recommended sets/reps, and detailed tracking.

The app manifest and workout program data are fetched asynchronously, ensuring flexibility and scalability.

## Features

-   Currently 4 Workout programs to choose from
-   Compound and isolation exercises with detailed metadata (equipment, muscle groups, recommended sets/reps)
-   Embedded video demos via YouTube
-   LocalStorage-powered state management including:

    -   Last accessed day tracking
    -   Current workout day rotation logic
    -   Program selection persistence
    -   Workout record tracking (sets, reps, weights)

-   Robust error handling and JSON validation
-   Fully modular code with async functions for data fetching and localStorage operations
-   Namespace isolation using app manifest name for localStorage keys

## Workout Programs

Workout programs are defined in JSON under `/assets/data/json/programs.json` with the following structure:

```json
{
	"workout_1": {
		"title": "Rotating 5-Day Cycle",
		"description": "A 5-day workout cycle that rotates through different muscle groups.",
		"imageUrl": "https://steelsupplements.com/cdn/shop/articles/single-arm-db-row-min_1000x.jpg?v=1662648403",
		"days": [
			{
				"day": 1,
				"title": "Push Day",
				"description": "Focus on pushing movements for the upper body.",
				"exercises": [
					{
						"name": "Barbell Overhead Press",
						"category": "strength",
						"type": "compound",
						"demo": "https://www.youtube.com/embed/cGnhixvC8uA?si=tP3aLjf3WIixQxxK",
						"recommended": "3 sets of 5-7 reps",
						"muscleGroups": ["shoulders", "triceps", "upper chest"],
						"equipment": ["barbell", "rack"],
						"recordLabels": ["sets", "reps", "weight"],
						"units": "kg",
						"rest": 90
					}
					/* ... other exercises ... */
				]
			}
			/* ... other days ... */
		]
	}
}
```

## Data Fetching

The app uses modular async functions to fetch JSON data for:

-   The web app's manifest (manifest.json) to extract app name and metadata
-   Workout programs JSON, supporting multiple workout plans

Data fetching is handled in /assets/data/js/fetchAppData.js:

-   fetchAppData(url) — generic JSON fetch with error handling
-   fetchManifest() — fetches app manifest
-   fetchPrograms() — fetches workout programs

These functions are exposed under the APP_DATA namespace for easy import and use.

## Local Storage Management

localStorageManager is a utility module that abstracts safe, asynchronous access to localStorage. Key features include:

-   Safe checks for localStorage availability
-   JSON serialisation and parsing with error handling
-   Typed keys scoped by app name (from manifest) to avoid collisions
-   Tracking last access date and rotating workout day index
-   Fetching the current workout day and workout data
-   Managing workout program selection and workout records

Example usage:

```javascript
import { LOCAL_STORAGE_MANAGER } from "./js/managers/localStorageManager.js";
const lastDayAccessed = await LOCAL_STORAGE_MANAGER.fetch.app.date.lastAccessed();
const workoutData = await LOCAL_STORAGE_MANAGER.fetch.workout.data();
```

## Getting started

1. Clone the repository
2. Ensure your environment supports ES Modules and top-level await (modern browsers recommended)
3. Serve the project with a local server to enable fetch for JSON assets (e.g., live-server, http-server)
4. Open the app in a browser and start your workout journey

## Usage

-   The app automatically progresses your workout day on each new calendar day accessed
-   The workout program and records are persisted locally and restored on reload.
-   Exercise demo videos are embedded from YouTube to guide proper form.
-   Rest days are included to promote recovery.

## Project Structure

```pqsql
assets/
	data/
		js/
			fetchAppData.js
			fetchWorkoutStats.js
		json/
			programs.json
css/
	style.css
icons/
	android-chrome-192x192.png
	android-chrome-512x512.png
	favicon-16x16.png
	favicon-32x32.png
	favicon.ico
	icon-192.png
	icon-512.png
js/
	components/
		Accordion.js
		Alert.js
		Card.js
		Form.js
		List.js
	handlers/
		click.js
		load.js
	managers/
		localStorageManager.js
	application.js
	applicationViews.js
	constants.js
	init.js
	utils.js
README.md
apple-touch-icon.png
index.html
manifest.json
service-worker.js
```

## Frameworks

- Google Icons
- Popper
- Bootstrap

## License

All Rights Reserved © 2025 Hercules

import { UTILITIES } from "../utils.js";
import { WORKOUT_STATS } from "../../assets/data/js/fetchWorkoutStats.js";

function createCard(data, key) {
	const card = document.createElement("div");
	card.classList.add("card");
	card.dataset.programKey = key;

	const img = document.createElement("img");
	img.classList.add("card-img-top");
	img.loading = "lazy";
	img.src = data?.imageUrl || "#";

	const body = document.createElement("div");
	body.classList.add("card-body");

	const title = document.createElement("h5");
	title.classList.add("card-title");
	title.textContent = data?.title || "Card Title";

	const description = document.createElement("p");
	description.classList.add("card-text");
	description.textContent =
		data?.description || "Card description goes here.";

	body.append(title, description);
	card.append(img, body);

	return card;
}

function createSingleExerciseProgressCard(
	exerciseName,
	records,
	type = "weight"
) {
	const card = document.createElement("div");
	card.classList.add("card", "progress-card");

	const lastTwoRecords = WORKOUT_STATS.penultimate(exerciseName, records);
	if (!lastTwoRecords) return;

	const data = WORKOUT_STATS.exerciseData(lastTwoRecords, type);
	if (!data || data.length < 2) return;

	const formattedName = exerciseName.replace(/_/g, " ");

	const date = records[exerciseName].splice(-1)[0]?.date;
	const formattedDate = UTILITIES.format.date.relative(date);

	const amountChange = WORKOUT_STATS.change.amount(data);

	const { iconName, colorSemantic } = returnIconAndColor(amountChange);

	// Create card body and content
	const body = document.createElement("div");
	body.classList.add("card-body");
	/**
	 * heading
	 * dataElement
	 * 		- dataParagraph
	 * 		- typeSpan
	 * 		- changeSpan
	 * 				- iconElement
	 * footer
	 * 		- completionSpan
	 */
	const heading = document.createElement("h6");
	heading.classList.add("secondary");
	heading.textContent =
		UTILITIES.format.text.capitalise_multiple(formattedName);

	const dataElement = document.createElement("div");
	dataElement.classList.add("progress-data");

	const dataParagraph = document.createElement("p");
	dataParagraph.textContent = `${data[1]} kg`; // Latest data point

	const typeSpan = document.createElement("span");
	typeSpan.classList.add("secondary");
	typeSpan.textContent = type;

	const changeSpan = document.createElement("span");
	changeSpan.textContent =
		amountChange === 0 ? "" : ` ${Math.abs(amountChange)}`;

	const iconElement = document.createElement("i");
	iconElement.classList.add("material-icons", colorSemantic);
	iconElement.textContent = iconName;

	const footer = document.createElement("div");
	footer.classList.add("card-footer");

	const completionSpan = document.createElement("span");
	completionSpan.textContent = `Completed ${formattedDate}`;

	footer.append(completionSpan);
	changeSpan.prepend(iconElement);
	dataElement.append(dataParagraph, typeSpan, changeSpan);
	body.append(heading, dataElement);
	card.append(body, footer);

	return card;
}

function returnIconAndColor(amount) {
	return amount < 0
		? { iconName: "trending_down", colorSemantic: "danger" }
		: amount > 0
		? { iconName: "trending_up", colorSemantic: "success" }
		: { iconName: "trending_flat", colorSemantic: "primary" };
}

export const CARD = {
	create: {
		default: createCard,
		progress: {
			exercise: createSingleExerciseProgressCard,
		},
	},
};

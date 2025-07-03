import { CARD } from "./Card.js";
import { CLICK_HANDLERS } from "../handlers/click.js";

function createPill(text = "Badge text", semantic = "primary") {
	if (typeof semantic !== "string") semantic = "primary";

	const span = document.createElement("span");
	span.classList.add("badge", "rounded-pill", `text-bg-${semantic}`);
	span.textContent = text;

	return span;
}

function createListOfCards(data) {
	const list = document.createElement("div");
	list.classList.add("list");
	list.id = "program-list";

	const programs = data;
	const keys = Object.keys(programs);
	const numberOfPrograms = keys.length;

	for (let i = 0; i < numberOfPrograms; i++) {
		const program = programs[keys[i]];
		list.append(CARD.create.default(program, keys[i]));
	}

	list.querySelectorAll(".card").forEach((card) => {
		card.removeEventListener("click", CLICK_HANDLERS.save.activeProgram);
		card.addEventListener("click", CLICK_HANDLERS.save.activeProgram);
	});

	return list;
}

export const LIST = {
	create: {
		cards: createListOfCards,
		pills: createPill,
	},
};

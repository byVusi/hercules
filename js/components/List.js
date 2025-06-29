import { clickOnProgramCard } from "../handlers.js";

export function createListOfCards(data) {
	const list = document.createElement("div");
	list.className = "list";
	list.id = "program-list";

	const programs = data;
	const keys = Object.keys(programs);
	const numberOfPrograms = keys.length;

	for (let i = 0; i < numberOfPrograms; i++) {
		const program = programs[keys[i]];
		list.innerHTML += createCard(program, keys[i]);
	}

	list.querySelectorAll(".card").forEach((card) => {
		card.removeEventListener("click", clickOnProgramCard);
		card.addEventListener("click", clickOnProgramCard);
	});

	return list;
}

function createCard(data, key) {
	const htmlString = `
    <div class="card" data-program-key="${key}">
        <img src="${data?.imageUrl}" class="card-img-top" alt="#">
        <div class="card-body">
            <h5 class="card-title">${data?.title}</h5>
            <p class="card-text">${data?.description}</p>
        </div>
    </div>
    `;
	return htmlString;
}

export function createPill(text = "Badge text", semantic = "primary") {
	if (typeof semantic !== "string") semantic = "primary";
	const htmlString = `
	<span class="badge rounded-pill text-bg-${semantic}">${text}</span>
	`;

	return htmlString;
}

export function createModal() {
	const div = document.createElement("div");
	div.classList.add("modal");
	div.tabIndex = -1;

	div.innerHTML = createModalDialog();
	div.querySelector(".modal-dialog").innerHTML = createModalContent();
	div.querySelector(".modal-content").innerHTML = createModalHeader();
	div.querySelector(".modal-content").innerHTML += createModalBody();
	div.querySelector(".modal-content").innerHTML += createModalFooter();

	return div;
}

// function createModalHeader() {
// 	const htmlString = `
//     <div class="modal" tabindex="-1">
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title">Modal title</h5>
//         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div class="modal-body">
//         <p>Modal body text goes here.</p>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Save changes</button>
//       </div>
//     </div>
//   </div>
// </div>
//     `;
// }

function createModalDialog() {
	const htmlString = `
    <div class="modal-dialog"></div>
    `;
	return htmlString;
}

function createModalContent() {
	const htmlString = `
    <div class="modal-content"> 
    </div>
    `;
	return htmlString;
}

function createModalHeader() {
	const htmlString = `
    <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    `;
	return htmlString;
}

function createModalBody() {
	const htmlString = `
    <div class="modal-body">
        <p>Modal body text goes here.</p>
    </div>
    `;
	return htmlString;
}

function createModalFooter() {
	const htmlString = `
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
    </div>
    `;
	return htmlString;
}

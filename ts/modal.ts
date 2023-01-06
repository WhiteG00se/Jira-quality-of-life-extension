function modalCode() {
	//don't run any code if modal was already loaded
	if (document.querySelector("#ex_modalButton") != null) return
	runCodeAtReadyState("interactive", loadModalButton, loadModal, localStorageToModal, submitModal)
}

function loadModalButton() {
	//load ex_modalButton into nav bar + add event listener to open the modal
	const addButtonHere: HTMLElement | null = document.querySelector("#quicksearch-menu")
	if (!addButtonHere) throw new Error("could not find #quicksearch-menu to add ex_modalButton")
	addButtonHere.insertAdjacentHTML("afterend", get_ex_modalButton())

	const addEventListenerHere: HTMLElement | null = document.querySelector("#ex_modalButton")
	if (!addEventListenerHere) throw new Error("couldn't find ex_modalButton to add event listener")
	addEventListenerHere.addEventListener("click", function () {
		const ex_modal: HTMLElement | null = document.querySelector("#ex_modal")
		if (!ex_modal) throw new Error("couldn't find ex_modal to open")
		ex_modal.style.display = "block"

		const auiBlanket: HTMLElement | null = document.querySelector(".aui-blanket")
		if (!auiBlanket) throw new Error("couldn't find aui-blanket remove 'hidden' attribute from")
		auiBlanket.removeAttribute("hidden")
	})
}
function loadModal() {
	//load ex_modal into page with "display: none"
	document.querySelector("body")!.insertAdjacentHTML("beforeend", get_ex_modal())
	//add event listener to cancel button
	document.querySelector("#ex_modal-cancel-button")!.addEventListener("click", function () {
		document.querySelector<HTMLElement>("#ex_modal")!.style.display = "none"
		document.querySelector(".aui-blanket")!.setAttribute("hidden", "")
	})
	if (getDebugMode()) console.log("ex_modal was loaded")
}
function localStorageToModal() {
	//load values for class ex_modalCheckbox
	document.querySelectorAll<HTMLInputElement>("input.ex_modalCheckbox").forEach(function (element) {
		if (localStorage.getItem(element.id) == "true") {
			element.checked = true
		} else {
			element.checked = false
		}
	})
	//load values for class ex_modalValue
	document.querySelectorAll<HTMLInputElement>(".ex_modalValue").forEach(function (element) {
		const value = localStorage.getItem(element.id)
		if (value == null) return
		element.value = value
	})
}
function submitModal() {
	//add event listener to submit button
	document.querySelector("#ex_modal-submit-button")!.addEventListener("click", function () {
		//set all values with class "ex_modalCheckbox" to localStorage
		document.querySelectorAll<HTMLInputElement>(".ex_modalCheckbox").forEach(function (element) {
			localStorage.setItem(element.id, element.checked.toString())
		})
		//set all values with class "ex_modalValue" to localStorage
		document.querySelectorAll<HTMLInputElement>(".ex_modalValue").forEach(function (element) {
			localStorage.setItem(element.id, element.value)
		})
		location.reload() //reload page to apply changes
	})
	//disable default form submit behavior
	document.querySelector("#ex_form")!.addEventListener("submit", function (event) {
		event.preventDefault()
	})
}

function userSettingsToArray(userSettings: string): string[] {
	let settingsArray: string[] = userSettings.split(",")
	settingsArray.forEach(function (entry, index) {
		settingsArray[index] = entry.trim()
	})
	return settingsArray
}

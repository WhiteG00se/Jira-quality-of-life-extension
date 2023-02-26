async function ticketPageCode() {
	commentOrder()
	collapseModulesAfterPageLoad()
	collapseCommentsAfterPageLoad()
	loadExpandCollapseButtons()
	copyTicketIdButton()
}

async function commentOrder() {
	const userSettings = localStorage.getItem("ex_selectCommentOrder")
	if (!userSettings) return

	const orderButton = await waitForSelector("#sort-button")
	switch (userSettings) {
		case "newestFirst":
			if (orderButton.getAttribute("data-order") === "asc") {
				if (getDebugMode()) console.log("comments are already in the correct order")
				return
			} else {
				orderButton.click()
				if (getDebugMode()) console.log("clicked on 'newest first' button")
				return
			}
		case "oldestFirst":
			if (orderButton.getAttribute("data-order") === "desc") {
				if (getDebugMode()) console.log("comments are already in the correct order")
				return
			} else {
				orderButton.click()
				if (getDebugMode()) console.log("clicked on 'oldest first' button")
				return
			}
	}
}
async function loadExpandCollapseButtons() {
	const userSetting = localStorage.getItem("ex_showExpandCollapseButtons")
	if (userSetting !== "true") return

	const addButtonsHere = await waitForSelector("#activitymodule_heading")

	//this function may be called via restoreExtensionElements(), maybe the buttons are already there
	if (document.querySelector("#ex_expandCollapseButtons")) return

	if (!addButtonsHere) {
		if (getDebugMode()) console.log("could not find where to add the expand/collapse buttons")
		return
	}

	addButtonsHere.insertAdjacentHTML("beforeend", get_ex_expandCollapseButtons())
	document.querySelector("#collapseComments")!.addEventListener("click", collapseComments)
	document.querySelector("#expandComments")!.addEventListener("click", expandComments)
}
async function collapseCommentsAfterPageLoad() {
	const userSetting = localStorage.getItem("ex_shouldCollapseCommentsAfterPageLoad")
	if (userSetting !== "true") return
	await waitForSelector(".twixi-block")
	collapseComments()
}
function collapseComments() {
	const comments = document.querySelectorAll(".twixi-block")
	if (comments.length == 0) {
		if (getDebugMode()) console.log("tried to collapse comments but couldn't find any")
		return
	}
	comments.forEach((comment) => {
		comment.classList.remove("expanded")
		comment.classList.add("collapsed")
	})
	if (getDebugMode()) console.log("collapsed all comments")
}
function expandComments() {
	const comments = document.querySelectorAll(".twixi-block")
	if (comments.length == 0) {
		if (getDebugMode()) console.log("tried to expand comments but couldn't find any")
		return
	}
	comments.forEach((comment) => {
		comment.classList.remove("collapsed")
		comment.classList.add("expanded")
	})
}
async function collapseModulesAfterPageLoad() {
	//split input into an array and trim all of the elements
	const userSettings = localStorage.getItem("ex_whatModulesToCollapseDuringPageLoad")
	if (!userSettings) return
	const modulesToCollapse = userSettingsToArray(userSettings)

	if (getDebugMode()) console.log("modules to collapse:")
	if (getDebugMode()) console.log(modulesToCollapse)

	await waitForSelector("button[aria-label]")
	modulesToCollapse.forEach(function (module) {
		collapseModule(module)
	})
}
function collapseModule(module: string) {
	// buttons with "aria-label"=module
	// there might be more than one module with the same lable ("Attachments" in my jira),
	// so we need to use querySelectorAll and work with arrays
	const moduleButtons: NodeListOf<HTMLElement> = document.querySelectorAll(
		"button[aria-label='" + module + "']"
	)
	if (moduleButtons.length == 0) return //guard clause

	moduleButtons.forEach(function (moduleButton) {
		const moduleContainer: HTMLElement | null = findModuleContainer(moduleButton)
		if (!moduleContainer) {
			if (getDebugMode()) console.log(`${module}: found a moduleButton but no moduleContainer`)
			return //guard clause
		}

		moduleButton.setAttribute("aria-expanded", "false")
		moduleContainer.classList.remove("expanded")
		moduleContainer.classList.add("collapsed")
		if (getDebugMode()) console.log(`${module}: moduleButton & moduleContainer found, module collapsed`)
	})
}
function findModuleContainer(moduleButton: HTMLElement): HTMLElement | null {
	//check parents of moduleButton until you find moduleContainer with class "module"
	let moduleContainer: HTMLElement = moduleButton.parentElement!
	while (!moduleContainer.classList.contains("module")) {
		if (moduleContainer.tagName == "BODY") {
			return null
		} else moduleContainer = moduleContainer.parentElement!
	}
	return moduleContainer
}

async function copyTicketIdButton() {
	const userSetting = localStorage.getItem("ex_showCopyTicketIdButton")
	if (userSetting !== "true") return

	const toolbar = await waitForSelector(".aui-toolbar2-primary")
	//this function may be called via restoreExtensionElements(), maybe the buttons are already there
	if (document.querySelector("#ex_copyTicketIdButton")) return

	if (!toolbar) {
		if (getDebugMode()) console.log("couldn't find the toolbar to add the copy ticket id button")
		return
	}

	toolbar.insertAdjacentHTML("beforeend", get_ex_copyTicketIdButton())
	document.querySelector("#ex_copyTicketIdButton")!.addEventListener("click", copyTicketId)

	if (getDebugMode()) console.log("added the copy ticket id button")
}

function copyTicketId() {
	const metaTag = document.querySelector("meta[name='ajs-issue-key']") as HTMLElement | null
	if (!metaTag) throw new Error("couldn't find the meta tag with the ticket id")

	const ticketId = metaTag.getAttribute("content")
	if (!ticketId) throw new Error("found the meta tag but couldn't get the ticket id")

	navigator.clipboard.writeText(ticketId)
	if (getDebugMode()) console.log("copied the ticket id to the clipboard")
}

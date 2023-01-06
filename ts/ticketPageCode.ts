function ticketPageCode(): void {
	runCodeAtReadyState(
		"complete",
		commentOrder,
		collapseModulesAfterPageLoad,
		collapseCommentsAfterPageLoad,
		loadExpandCollapseButtons,
		copyTicketIdButton
	)
}

function commentOrder(): void {
	const commentOrder: string | null = localStorage.getItem("ex_selectCommentOrder")
	if (!commentOrder) return //user settings

	let orderButton: HTMLElement | null
	switch (commentOrder) {
		case "newestFirst":
			orderButton = document.querySelector("#activitymodule .issue-activity-sort-link .aui-iconfont-up")
			if (!orderButton) {
				if (getDebugMode()) console.log("could not find 'newest first' button")
				return
			}
			orderButton.click()
			if (getDebugMode()) console.log("clicked on 'newest first' button")
			break
		case "oldestFirst":
			orderButton = document.querySelector("#activitymodule .issue-activity-sort-link .aui-iconfont-down")
			if (!orderButton) {
				if (getDebugMode()) console.log("could not find 'oldest first' button")
				return
			}
			orderButton.click()
			if (getDebugMode()) console.log("clicked on 'oldest first' button")
			break
	}
}
function loadExpandCollapseButtons(): void {
	const userSetting = localStorage.getItem("ex_showExpandCollapseButtons")
	if (!userSetting) return //user settings
	//this function may be called via restoreExtensionElements(), maybe the buttons are already there
	if (document.querySelector("#ex_expandCollapseButtons")) return

	const addButtonsHere: HTMLElement | null = document.querySelector("#activitymodule_heading h4")
	if (!addButtonsHere) {
		if (getDebugMode()) console.log("could not find where to add the expand/collapse buttons")
		return
	}

	addButtonsHere.insertAdjacentHTML("afterend", get_ex_expandCollapseButtons())
	document.querySelector("#collapseComments")!.addEventListener("click", collapseComments)
	document.querySelector("#expandComments")!.addEventListener("click", expandComments)
}
function collapseCommentsAfterPageLoad(): void {
	const userSetting = localStorage.getItem("ex_shouldCollapseCommentsAfterPageLoad")
	if (userSetting != "true") return //user settings

	//avoid issues with with commentOrder() and loadAllCommentsAfterPageLoad()
	if (document.readyState === "complete") {
		collapseComments()
	} else {
		document.addEventListener("readystatechange", () => {
			if (document.readyState === "complete") {
				collapseComments()
			}
		})
	}
}
function collapseComments(): void {
	const comments: NodeListOf<HTMLElement> = document.querySelectorAll(".twixi-block")
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
function expandComments(): void {
	const comments: NodeListOf<HTMLElement> = document.querySelectorAll(".twixi-block")
	if (comments.length == 0) {
		if (getDebugMode()) console.log("tried to expand comments but couldn't find any")
		return
	}
	comments.forEach((comment) => {
		comment.classList.remove("collapsed")
		comment.classList.add("expanded")
	})
}
function collapseModulesAfterPageLoad(): void {
	//split input into an array and trim all of the elements
	const userSettings: string | null = localStorage.getItem("ex_whatModulesToCollapseDuringPageLoad")
	if (!userSettings) return //user settings
	const modulesToCollapse: string[] = userSettingsToArray(userSettings)

	if (getDebugMode()) console.log("modules to collapse:")
	if (getDebugMode()) console.log(modulesToCollapse)

	modulesToCollapse.forEach(function (module) {
		collapseModule(module)
	})
}
function collapseModule(module: string): void {
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

function copyTicketIdButton(): void {
	const userSetting: string | null = localStorage.getItem("ex_showCopyTicketIdButton")
	if (userSetting !== "true") return
	//this function may be called via restoreExtensionElements(), maybe the buttons are already there
	if (document.querySelector("#ex_copyTicketIdButton")) return

	const toolbar: HTMLElement | null = document.querySelector(".aui-toolbar2-primary")
	if (!toolbar) {
		if (getDebugMode()) console.log("couldn't find the toolbar to add the copy ticket id button")
		return
	}

	toolbar.insertAdjacentHTML("beforeend", get_ex_copyTicketIdButton())
	document.querySelector("#ex_copyTicketIdButton")!.addEventListener("click", copyTicketId)

	if (getDebugMode()) console.log("added the copy ticket id button")
}

function copyTicketId(): void {
	const metaTag: HTMLElement | null = document.querySelector("meta[name='ajs-issue-key']")
	if (!metaTag) throw new Error("couldn't find the meta tag with the ticket id")

	const ticketId: string | null = metaTag.getAttribute("content")
	if (!ticketId) throw new Error("found the meta tag but couldn't get the ticket id")

	navigator.clipboard.writeText(ticketId)
	if (getDebugMode()) console.log("copied the ticket id to the clipboard")
}

function initializeObserver(): void {
	const monitoredNode: Node = document.querySelector("body")!
	const ex_mutationObserver = new MutationObserver((entries) => {
		monitorPageChanges()
	})
	ex_mutationObserver.observe(monitoredNode, { childList: true, subtree: true })
}

function monitorPageChanges(): void {
	const oldPageTitle: string = sessionStorage?.getItem("ex_pageTitle") ?? ""
	const newPageTitle: string = getPageTitle()
	const oldPageURL: string = sessionStorage?.getItem("ex_pageURL") ?? ""
	const newPageURL: string = window.location.href
	//wait until both the pageTitle and the pageURL have changed
	if (oldPageTitle != newPageTitle && oldPageURL != newPageURL) {
		//only run code if neither were previously empty strings (empty when first loading the page)
		if (oldPageTitle != "" && oldPageURL != "") {
			if (getDebugMode()) console.log(`pageTitle changed from '${oldPageTitle}' to '${newPageTitle}'`)
			if (getDebugMode()) console.log(`pageURL changed from '${oldPageURL}' to '${newPageURL}'`)
			runCodeForPagetype()
		}
		sessionStorage.setItem("ex_pageTitle", newPageTitle)
		sessionStorage.setItem("ex_pageURL", newPageURL)
	}
	//check if jira broke any extension elements and restore them
	else {
		if (getDebugMode()) console.log("childList of body changed, checking if any elements need to be restored")
		restoreExtensionForPagetype()
	}
}

function getPageTitle(): string {
	const pageTitle: string = document.querySelector("title")?.innerText ?? ""
	if (pageTitle == "") throw new Error("Error: could not get pageTitle")
	return pageTitle
}

function getPageType(): string {
	const URL: string = window.location.href
	let pageType: string = "default"
	const ticketRegex: RegExp = /(\/browse\/[A-Za-z0-9]+-[0-9]+.*)|(\/issues\/[A-Za-z0-9]+-[0-9]+.*)/i
	switch (true) {
		case URL.toLowerCase().includes("/plugins"):
			pageType = "plugin"
			break
		case URL.toLowerCase().includes("/dashboard.jspa"):
			pageType = "dashboard"
			break
		case ticketRegex.test(URL):
			pageType = "ticket"
			break
	}
	if (getDebugMode()) console.log(`pageType: '${pageType}' | URL: '${URL}'`)
	return pageType
}

//readyStates: loading, interactive, complete
function runCodeAtReadyState(whenToRun: string, ...functions: Function[]): void {
	const currentState: string = document.readyState
	if (currentState === whenToRun) functions.forEach((func) => func())
	else {
		const whenToRunOrdinal: number = getReadyStateOrdinal(whenToRun)
		const currentStateOrdinal: number = getReadyStateOrdinal(currentState)
		if (currentStateOrdinal > whenToRunOrdinal)
			throw new Error(`Timing missed: currentState: (${currentState}) and whenToRun: (${whenToRun})`)
		document.addEventListener("readystatechange", () => {
			if (document.readyState === whenToRun) functions.forEach((func) => func())
		})
	}
}
function getReadyStateOrdinal(readyState: string): number {
	switch (readyState) {
		case "loading":
			return 0
			break
		case "interactive":
			return 1
			break
		case "complete":
			return 2
			break
		default:
			throw new Error(`Error: readyState '${readyState}' was not defined`)
	}
}

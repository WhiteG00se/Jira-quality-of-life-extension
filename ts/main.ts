runCodeAtReadyState("interactive", runCodeForPagetype)
runCodeAtReadyState("complete", initializeObserver)

function runCodeForPagetype(): void {
	const pageType: string = getPageType()
	if (pageType == "plugin") return
	modalCode()
	switch (pageType) {
		case "dashboard":
			dashboardPageCode()
			break
		case "ticket":
			ticketPageCode()
			break
	}
}
function restoreExtensionForPagetype(): void {
	const pageType: string = getPageType()
	//enter the functions here that restore the extension elements
	switch (pageType) {
		case "dashboard":
			break
		case "ticket":
			loadExpandCollapseButtons()
			copyTicketIdButton()
			break
	}
}

function getDebugMode(): boolean {
	if (localStorage.getItem("ex_debugMode") == "true") {
		return true
	} else {
		return false
	}
}

main()
function main() {
	if (!isJira()) return
	runCodeForPagetype()
	initializeObserver()
}

function runCodeForPagetype(): void {
	const pageType: string = getPageType()
	if (pageType == "plugin") return
	if (getDebugMode()) console.log(`pageType: '${pageType}'`)

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

function isJira() {
	//Jira should have the following meta tag in the head:
	//<meta name="application-name" content="JIRA" data-name="jira" data-version="X.X.X">
	const metaTags = document.querySelectorAll("meta")
	for (const metaTag of metaTags) {
		if (metaTag.name == "application-name" && metaTag.content == "JIRA") {
			if (getDebugMode()) console.log("this website is Jira!")
			return true
		}
	}
	if (getDebugMode()) console.log("this website is not Jira!")
	return false
}

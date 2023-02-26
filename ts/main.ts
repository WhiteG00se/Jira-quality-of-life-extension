main()
function main() {
	if (!isJira()) return
	runCodeForPagetype()
	initializeObserver()
}

function runCodeForPagetype() {
	const pageType = getPageType()
	if (pageType == "plugin") return
	if (getDebugMode()) console.log(`pageType'${pageType}'`)

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
function restoreExtensionForPagetype() {
	const pageType = getPageType()
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

function getDebugMode() {
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
			//can't use "if (getDebugMode())" here, check comment below
			console.log("this website is Jira!")
			return true
		}
	}
	//can't use "if (getDebugMode())" here because then I'd get no console output if the website is not Jira
	console.log("this website is not Jira!")
	return false
}

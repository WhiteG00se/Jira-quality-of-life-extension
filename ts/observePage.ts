function initializeObserver() {
	const monitoredNode = document.body
	const ex_mutationObserver = new MutationObserver((entries) => {
		monitorPageChanges()
	})
	ex_mutationObserver.observe(monitoredNode, { childList: true, subtree: true })
}

function monitorPageChanges() {
	const oldPageTitle = sessionStorage?.getItem("ex_pageTitle") ?? ""
	const newPageTitle = document.title
	const oldPageURL = sessionStorage?.getItem("ex_pageURL") ?? ""
	const newPageURL = window.location.href
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

function getPageType() {
	let pageType = "default"
	const URL = window.location.href
	if (URL.toLowerCase().includes("/plugins")) pageType = "plugin"
	else if (document.body.classList.contains("page-type-dashboard")) pageType = "dashboard"
	else if (URL.includes("/browse/") || (URL.includes("/projects/") && URL.includes("/queues/"))) {
		const parts = URL.split("/")
		const lastPart = parts[parts.length - 1]

		if (/^[a-zA-Z]+-[0-9]+/.test(lastPart)) {
			pageType = "ticket"
		}
	}

	return pageType
}

function waitForSelector(selector: string): Promise<HTMLElement> {
	return new Promise((resolve) => {
		const selectedElement = document.querySelector(selector)
		if (selectedElement) {
			resolve(selectedElement as HTMLElement)
			return
		}

		const observer = new MutationObserver((mutations) => {
			const selectedElement = document.querySelector(selector)
			if (selectedElement) {
				resolve(selectedElement as HTMLElement)
				observer.disconnect()
			}
		})

		observer.observe(document, {
			childList: true,
			subtree: true
		})
	})
}

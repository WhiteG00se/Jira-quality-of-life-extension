function initializeObserver(): void {
	const monitoredNode: Node = document.body
	const ex_mutationObserver = new MutationObserver((entries) => {
		monitorPageChanges()
	})
	ex_mutationObserver.observe(monitoredNode, { childList: true, subtree: true })
}

function monitorPageChanges(): void {
	const oldPageTitle: string = sessionStorage?.getItem("ex_pageTitle") ?? ""
	const newPageTitle: string = document.title
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

function getPageType(): string {
	let pageType = "default"
	const URL = window.location.href
	if (URL.toLowerCase().includes("/plugins")) pageType = "plugin"
	// if it's not a plugin page, if there is a meta with the name 'ajs-viewissue-use-history-api'
	// then it's a ticket page
	else if (document.querySelector("meta[name='ajs-viewissue-use-history-api']")) pageType = "ticket"
	// if it's not a plugin page or a ticket page, then check if it's a dashboard page
	// by checking if the body has the class 'page-type-dashboard'
	else if (document.body.classList.contains("page-type-dashboard")) pageType = "dashboard"
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

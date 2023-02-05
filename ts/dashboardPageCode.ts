function dashboardPageCode(): void {
	removeSidebar()
	refreshDashboard()
	notificationBell()
}
async function removeSidebar() {
	const userSetting = localStorage.getItem("ex_removeSidebar")
	if (userSetting !== "true") return

	const sidebar = await waitForSelector("#dashboard .dashboard-tabs")
	if (!sidebar) {
		if (getDebugMode()) console.info("could not find and remove sidebar")
		return
	}
	sidebar.remove()
	if (getDebugMode()) console.log("Sidebar removed")
}
function refreshDashboard(): void {
	const userSetting: string | null = localStorage.getItem("ex_refreshDashboardInterval")
	if (!userSetting) return
	const interval: number = parseInt(userSetting)

	setInterval(function () {
		// check if there is an element with id "create-issue-dialog" AND if "ex_modal" is visible AND if pageType is "dashboard"
		if (
			document.querySelector("#create-issue-dialog") == null &&
			document.querySelector<HTMLElement>("#ex_modal")!.style.display == "none" &&
			getPageType() == "dashboard"
		) {
			location.reload()
		} else {
			if (getDebugMode()) console.log('did not refresh because "Create Issue" or "ex_modal" dialog is open')
		}
	}, interval * 1000)
	// log to console if debug mode is enabled
	if (getDebugMode()) console.log("Refreshing dashboard every " + interval + " seconds")
}
async function notificationBell() {
	const userSetting = localStorage.getItem("ex_notificationBell")
	if (userSetting !== "true") return

	const test = await getTicketUpdates()
	console.log(test)
}
async function getTicketUpdates() {
	const select = "key,summary,self"
	const query = "watcher=currentUser()"
	const limit = 50
	const domain = window.location.hostname
	const apiUrl = `https://${domain}/rest/api/2/search?jql=${encodeURIComponent(
		query
	)}&maxResults=${limit}&fields=${select}`
	try {
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Basic "
			}
		})
		const data = await response.json()
		const issues = data.issues
		return issues
	} catch (error) {
		console.error(error)
	}
}

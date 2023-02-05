function dashboardPageCode(): void {
	removeSidebar()
	refreshDashboard()
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

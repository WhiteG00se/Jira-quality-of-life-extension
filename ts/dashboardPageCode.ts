function dashboardPageCode(): void {
	runCodeAtReadyState("interactive", removeSidebar)
	runCodeAtReadyState("complete", refreshDashboard)
}
function removeSidebar(): void {
	const userSetting = localStorage.getItem("ex_removeSidebar")
	if (userSetting != "true") return //user settings

	const sidebar: HTMLElement | null = document.querySelector("#dashboard .dashboard-tabs")
	if (!sidebar) {
		if (getDebugMode()) console.info("could not find and remove sidebar")
		return
	}
	sidebar.remove()
	if (getDebugMode()) console.log("Sidebar removed")
}
function refreshDashboard(): void {
	const intervalString: string | null = localStorage.getItem("ex_refreshDashboardInterval")
	if (!intervalString) return // check localStorage
	const interval: number = parseInt(intervalString)

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

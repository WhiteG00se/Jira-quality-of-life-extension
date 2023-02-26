function dashboardPageCode() {
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
function refreshDashboard() {
	const userSetting = localStorage.getItem("ex_refreshDashboardInterval")
	if (!userSetting) return
	const interval = parseInt(userSetting)

	setInterval(function () {
		// check if there is an element with id "create-issue-dialog" AND if "ex_modal" is visible AND if pageType is "dashboard"
		const ex_modal = document.querySelector("#ex_modal") as HTMLElement | null
		if (!ex_modal) throw new Error("couldn't find ex_modal during refresh check")
		if (
			getPageType() == "dashboard" &&
			!document.querySelector("#create-issue-dialog") &&
			ex_modal.style.display == "none"
		) {
			location.reload()
		} else {
			if (getDebugMode()) console.log("did not refresh because of modal or pageType")
		}
	}, interval * 1000)
	// log to console if debug mode is enabled
	if (getDebugMode()) console.log("Refreshing dashboard every " + interval + " seconds")
}

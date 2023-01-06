"use strict";
function dashboardPageCode() {
    runCodeAtReadyState("interactive", removeSidebar);
    runCodeAtReadyState("complete", refreshDashboard);
}
function removeSidebar() {
    const userSetting = localStorage.getItem("ex_removeSidebar");
    if (userSetting != "true")
        return; //user settings
    const sidebar = document.querySelector("#dashboard .dashboard-tabs");
    if (!sidebar) {
        if (getDebugMode())
            console.info("could not find and remove sidebar");
        return;
    }
    sidebar.remove();
    if (getDebugMode())
        console.log("Sidebar removed");
}
function refreshDashboard() {
    const intervalString = localStorage.getItem("ex_refreshDashboardInterval");
    if (!intervalString)
        return; // check localStorage
    const interval = parseInt(intervalString);
    setInterval(function () {
        // check if there is an element with id "create-issue-dialog" AND if "ex_modal" is visible AND if pageType is "dashboard"
        if (document.querySelector("#create-issue-dialog") == null &&
            document.querySelector("#ex_modal").style.display == "none" &&
            getPageType() == "dashboard") {
            location.reload();
        }
        else {
            if (getDebugMode())
                console.log('did not refresh because "Create Issue" or "ex_modal" dialog is open');
        }
    }, interval * 1000);
    // log to console if debug mode is enabled
    if (getDebugMode())
        console.log("Refreshing dashboard every " + interval + " seconds");
}
function get_ex_modalButton() {
    const html = `
<button id="ex_modalButton">
	<h3>&#9889</h3>
</button>`;
    return html;
}
function get_ex_modal() {
    const html = `
<span id="ex_modal" style="display: none">
	<section class="aui-layer aui-dialog2 aui-dialog2-large" open="" style="z-index: 3000;" tabindex="-1">
		<header class="aui-dialog2-header">
			<h2 class="aui-dialog2-header-main">quality of life extension</h2>
		</header>
		<div class="aui-dialog2-content">
			<form id="ex_form">
				<h2>dashboard settings</h2>
				<table>
					<tr>
						<td>
							refresh the page <abbr
								title='does not refresh while "Create Issue" dialoge or this extension menu is open'> every x
								minutes</abbr> (0 to disable)
						</td>
						<td>
							<select class="ex_modalValue" id="ex_refreshDashboardInterval">
								<option value="">0</option>
								<option value="60">1</option>
								<option value="120">2</option>
								<option value="180">3</option>
								<option value="240">4</option>
								<option value="300">5</option>
								<option value="360">6</option>
								<option value="420">7</option>
								<option value="480">8</option>
								<option value="540">9</option>
								<option value="600">10</option>
								<option value="660">11</option>
								<option value="720">12</option>
								<option value="780">13</option>
								<option value="840">14</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>
							remove sidebar?
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_removeSidebar">
						</td>
					</tr>
				</table>
				<hr>
				<h2>ticket page settings</h2>
				<table>
					<tr>
						<td>
							show button to copy ticket id
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_showCopyTicketIdButton">
						</td>
					</tr>
					<tr>
						<td>
							collapse all comments after loading the page
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_shouldCollapseCommentsAfterPageLoad">
						</td>
					</tr>
					<tr>
						<td>
							show buttons to expand/collapse all comments at once
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_showExpandCollapseButtons">
						</td>
					</tr>
					<tr>
						<td>
							default comment order
						</td>
						<td>
							<select class="ex_modalValue" id="ex_selectCommentOrder">
								<option value="newestFirst">newest first</option>
								<option value="oldestFirst">oldest first</option>
								<option value="">jira default</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>
							collapse modules after loading the page, <abbr
								title="example (case sensitive): 'Description, Attachments, Issue Links, Test Coverage, Agile'">
								help?</abbr>
						</td>
						<td>
							<!-- jira causes problems with type="text" -->
							<input type="definitely_not_text" class="ex_modalValue" id="ex_whatModulesToCollapseDuringPageLoad">
						</td>
					</tr>
				</table>
				<hr>
				<h2>dev settings</h2>
				<table>
					<tr>
						<td>
							console logs for debugging
						</td>
						<td>
							<input type="checkbox" class="ex_modalCheckbox" id="ex_debugMode">
						</td>
				</table>
			</form>
		</div>
		<footer class="aui-dialog2-footer">
			<div class="aui-dialog2-footer-actions">
				<button id="ex_modal-submit-button" class="aui-button aui-button-primary" resolved="">Submit</button>
				<button id="ex_modal-cancel-button" class="aui-button aui-button-link" resolved="">Cancel</button>
			</div>
			<div class="aui-dialog2-footer-hint">Made by Tobias L</div>
		</footer>
	</section>
</span>
<div aria-hidden="true" class="aui-blanket" tabindex="0" hidden=""></div>
`;
    return html;
}
function get_ex_expandCollapseButtons() {
    const html = `
<span id="ex_expandCollapseButtons">
	<button id="expandComments">expand all</button>
	<button id="collapseComments">collapse all</button>
</span>
`;
    return html;
}
function get_ex_copyTicketIdButton() {
    const html = `
<div id="ex_copyTicketIdButton" class="aui-buttons pluggable-ops">
	<a title="copy ticket id to clipboard" class="aui-button toolbar-trigger">
		<span class="trigger-label">Copy Ticket ID</span></a>
</div>
`;
    return html;
}
runCodeAtReadyState("interactive", runCodeForPagetype);
runCodeAtReadyState("complete", initializeObserver);
function runCodeForPagetype() {
    const pageType = getPageType();
    if (pageType == "plugin")
        return;
    modalCode();
    switch (pageType) {
        case "dashboard":
            dashboardPageCode();
            break;
        case "ticket":
            ticketPageCode();
            break;
    }
}
function restoreExtensionForPagetype() {
    const pageType = getPageType();
    //enter the functions here that restore the extension elements
    switch (pageType) {
        case "dashboard":
            break;
        case "ticket":
            loadExpandCollapseButtons();
            copyTicketIdButton();
            break;
    }
}
function getDebugMode() {
    if (localStorage.getItem("ex_debugMode") == "true") {
        return true;
    }
    else {
        return false;
    }
}
function modalCode() {
    //don't run any code if modal was already loaded
    if (document.querySelector("#ex_modalButton") != null)
        return;
    runCodeAtReadyState("interactive", loadModalButton, loadModal, localStorageToModal, submitModal);
}
function loadModalButton() {
    //load ex_modalButton into nav bar + add event listener to open the modal
    const addButtonHere = document.querySelector("#quicksearch-menu");
    if (!addButtonHere)
        throw new Error("could not find #quicksearch-menu to add ex_modalButton");
    addButtonHere.insertAdjacentHTML("afterend", get_ex_modalButton());
    const addEventListenerHere = document.querySelector("#ex_modalButton");
    if (!addEventListenerHere)
        throw new Error("couldn't find ex_modalButton to add event listener");
    addEventListenerHere.addEventListener("click", function () {
        const ex_modal = document.querySelector("#ex_modal");
        if (!ex_modal)
            throw new Error("couldn't find ex_modal to open");
        ex_modal.style.display = "block";
        const auiBlanket = document.querySelector(".aui-blanket");
        if (!auiBlanket)
            throw new Error("couldn't find aui-blanket remove 'hidden' attribute from");
        auiBlanket.removeAttribute("hidden");
    });
}
function loadModal() {
    //load ex_modal into page with "display: none"
    document.querySelector("body").insertAdjacentHTML("beforeend", get_ex_modal());
    //add event listener to cancel button
    document.querySelector("#ex_modal-cancel-button").addEventListener("click", function () {
        document.querySelector("#ex_modal").style.display = "none";
        document.querySelector(".aui-blanket").setAttribute("hidden", "");
    });
    if (getDebugMode())
        console.log("ex_modal was loaded");
}
function localStorageToModal() {
    //load values for class ex_modalCheckbox
    document.querySelectorAll("input.ex_modalCheckbox").forEach(function (element) {
        if (localStorage.getItem(element.id) == "true") {
            element.checked = true;
        }
        else {
            element.checked = false;
        }
    });
    //load values for class ex_modalValue
    document.querySelectorAll(".ex_modalValue").forEach(function (element) {
        const value = localStorage.getItem(element.id);
        if (value == null)
            return;
        element.value = value;
    });
}
function submitModal() {
    //add event listener to submit button
    document.querySelector("#ex_modal-submit-button").addEventListener("click", function () {
        //set all values with class "ex_modalCheckbox" to localStorage
        document.querySelectorAll(".ex_modalCheckbox").forEach(function (element) {
            localStorage.setItem(element.id, element.checked.toString());
        });
        //set all values with class "ex_modalValue" to localStorage
        document.querySelectorAll(".ex_modalValue").forEach(function (element) {
            localStorage.setItem(element.id, element.value);
        });
        location.reload(); //reload page to apply changes
    });
    //disable default form submit behavior
    document.querySelector("#ex_form").addEventListener("submit", function (event) {
        event.preventDefault();
    });
}
function userSettingsToArray(userSettings) {
    let settingsArray = userSettings.split(",");
    settingsArray.forEach(function (entry, index) {
        settingsArray[index] = entry.trim();
    });
    return settingsArray;
}
function initializeObserver() {
    const monitoredNode = document.querySelector("body");
    const ex_mutationObserver = new MutationObserver((entries) => {
        monitorPageChanges();
    });
    ex_mutationObserver.observe(monitoredNode, { childList: true, subtree: true });
}
function monitorPageChanges() {
    const oldPageTitle = sessionStorage?.getItem("ex_pageTitle") ?? "";
    const newPageTitle = getPageTitle();
    const oldPageURL = sessionStorage?.getItem("ex_pageURL") ?? "";
    const newPageURL = window.location.href;
    //wait until both the pageTitle and the pageURL have changed
    if (oldPageTitle != newPageTitle && oldPageURL != newPageURL) {
        //only run code if neither were previously empty strings (empty when first loading the page)
        if (oldPageTitle != "" && oldPageURL != "") {
            if (getDebugMode())
                console.log(`pageTitle changed from '${oldPageTitle}' to '${newPageTitle}'`);
            if (getDebugMode())
                console.log(`pageURL changed from '${oldPageURL}' to '${newPageURL}'`);
            runCodeForPagetype();
        }
        sessionStorage.setItem("ex_pageTitle", newPageTitle);
        sessionStorage.setItem("ex_pageURL", newPageURL);
    }
    //check if jira broke any extension elements and restore them
    else {
        if (getDebugMode())
            console.log("childList of body changed, checking if any elements need to be restored");
        restoreExtensionForPagetype();
    }
}
function getPageTitle() {
    const pageTitle = document.querySelector("title")?.innerText ?? "";
    if (pageTitle == "")
        throw new Error("Error: could not get pageTitle");
    return pageTitle;
}
function getPageType() {
    const URL = window.location.href;
    let pageType = "default";
    const ticketRegex = /(\/browse\/[A-Za-z0-9]+-[0-9]+.*)|(\/issues\/[A-Za-z0-9]+-[0-9]+.*)/i;
    switch (true) {
        case URL.toLowerCase().includes("/plugins"):
            pageType = "plugin";
            break;
        case URL.toLowerCase().includes("/dashboard.jspa"):
            pageType = "dashboard";
            break;
        case ticketRegex.test(URL):
            pageType = "ticket";
            break;
    }
    if (getDebugMode())
        console.log(`pageType: '${pageType}' | URL: '${URL}'`);
    return pageType;
}
//readyStates: loading, interactive, complete
function runCodeAtReadyState(whenToRun, ...functions) {
    const currentState = document.readyState;
    if (currentState === whenToRun)
        functions.forEach((func) => func());
    else {
        const whenToRunOrdinal = getReadyStateOrdinal(whenToRun);
        const currentStateOrdinal = getReadyStateOrdinal(currentState);
        if (currentStateOrdinal > whenToRunOrdinal)
            throw new Error(`Timing missed: currentState: (${currentState}) and whenToRun: (${whenToRun})`);
        document.addEventListener("readystatechange", () => {
            if (document.readyState === whenToRun)
                functions.forEach((func) => func());
        });
    }
}
function getReadyStateOrdinal(readyState) {
    switch (readyState) {
        case "loading":
            return 0;
            break;
        case "interactive":
            return 1;
            break;
        case "complete":
            return 2;
            break;
        default:
            throw new Error(`Error: readyState '${readyState}' was not defined`);
    }
}
function ticketPageCode() {
    runCodeAtReadyState("complete", commentOrder, collapseModulesAfterPageLoad, collapseCommentsAfterPageLoad, loadExpandCollapseButtons, copyTicketIdButton);
}
function commentOrder() {
    const commentOrder = localStorage.getItem("ex_selectCommentOrder");
    if (!commentOrder)
        return; //user settings
    let orderButton;
    switch (commentOrder) {
        case "newestFirst":
            orderButton = document.querySelector("#activitymodule .issue-activity-sort-link .aui-iconfont-up");
            if (!orderButton) {
                if (getDebugMode())
                    console.log("could not find 'newest first' button");
                return;
            }
            orderButton.click();
            if (getDebugMode())
                console.log("clicked on 'newest first' button");
            break;
        case "oldestFirst":
            orderButton = document.querySelector("#activitymodule .issue-activity-sort-link .aui-iconfont-down");
            if (!orderButton) {
                if (getDebugMode())
                    console.log("could not find 'oldest first' button");
                return;
            }
            orderButton.click();
            if (getDebugMode())
                console.log("clicked on 'oldest first' button");
            break;
    }
}
function loadExpandCollapseButtons() {
    const userSetting = localStorage.getItem("ex_showExpandCollapseButtons");
    if (!userSetting)
        return; //user settings
    //this function may be called via restoreExtensionElements(), maybe the buttons are already there
    if (document.querySelector("#ex_expandCollapseButtons"))
        return;
    const addButtonsHere = document.querySelector("#activitymodule_heading h4");
    if (!addButtonsHere) {
        if (getDebugMode())
            console.log("could not find where to add the expand/collapse buttons");
        return;
    }
    addButtonsHere.insertAdjacentHTML("afterend", get_ex_expandCollapseButtons());
    document.querySelector("#collapseComments").addEventListener("click", collapseComments);
    document.querySelector("#expandComments").addEventListener("click", expandComments);
}
function collapseCommentsAfterPageLoad() {
    const userSetting = localStorage.getItem("ex_shouldCollapseCommentsAfterPageLoad");
    if (userSetting != "true")
        return; //user settings
    //avoid issues with with commentOrder() and loadAllCommentsAfterPageLoad()
    if (document.readyState === "complete") {
        collapseComments();
    }
    else {
        document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {
                collapseComments();
            }
        });
    }
}
function collapseComments() {
    const comments = document.querySelectorAll(".twixi-block");
    if (comments.length == 0) {
        if (getDebugMode())
            console.log("tried to collapse comments but couldn't find any");
        return;
    }
    comments.forEach((comment) => {
        comment.classList.remove("expanded");
        comment.classList.add("collapsed");
    });
    if (getDebugMode())
        console.log("collapsed all comments");
}
function expandComments() {
    const comments = document.querySelectorAll(".twixi-block");
    if (comments.length == 0) {
        if (getDebugMode())
            console.log("tried to expand comments but couldn't find any");
        return;
    }
    comments.forEach((comment) => {
        comment.classList.remove("collapsed");
        comment.classList.add("expanded");
    });
}
function collapseModulesAfterPageLoad() {
    //split input into an array and trim all of the elements
    const userSettings = localStorage.getItem("ex_whatModulesToCollapseDuringPageLoad");
    if (!userSettings)
        return; //user settings
    const modulesToCollapse = userSettingsToArray(userSettings);
    if (getDebugMode())
        console.log("modules to collapse:");
    if (getDebugMode())
        console.log(modulesToCollapse);
    modulesToCollapse.forEach(function (module) {
        collapseModule(module);
    });
}
function collapseModule(module) {
    // buttons with "aria-label"=module
    // there might be more than one module with the same lable ("Attachments" in my jira),
    // so we need to use querySelectorAll and work with arrays
    const moduleButtons = document.querySelectorAll("button[aria-label='" + module + "']");
    if (moduleButtons.length == 0)
        return; //guard clause
    moduleButtons.forEach(function (moduleButton) {
        const moduleContainer = findModuleContainer(moduleButton);
        if (!moduleContainer) {
            if (getDebugMode())
                console.log(`${module}: found a moduleButton but no moduleContainer`);
            return; //guard clause
        }
        moduleButton.setAttribute("aria-expanded", "false");
        moduleContainer.classList.remove("expanded");
        moduleContainer.classList.add("collapsed");
        if (getDebugMode())
            console.log(`${module}: moduleButton & moduleContainer found, module collapsed`);
    });
}
function findModuleContainer(moduleButton) {
    //check parents of moduleButton until you find moduleContainer with class "module"
    let moduleContainer = moduleButton.parentElement;
    while (!moduleContainer.classList.contains("module")) {
        if (moduleContainer.tagName == "BODY") {
            return null;
        }
        else
            moduleContainer = moduleContainer.parentElement;
    }
    return moduleContainer;
}
function copyTicketIdButton() {
    const userSetting = localStorage.getItem("ex_showCopyTicketIdButton");
    if (userSetting !== "true")
        return;
    //this function may be called via restoreExtensionElements(), maybe the buttons are already there
    if (document.querySelector("#ex_copyTicketIdButton"))
        return;
    const toolbar = document.querySelector(".aui-toolbar2-primary");
    if (!toolbar) {
        if (getDebugMode())
            console.log("couldn't find the toolbar to add the copy ticket id button");
        return;
    }
    toolbar.insertAdjacentHTML("beforeend", get_ex_copyTicketIdButton());
    document.querySelector("#ex_copyTicketIdButton").addEventListener("click", copyTicketId);
    if (getDebugMode())
        console.log("added the copy ticket id button");
}
function copyTicketId() {
    const metaTag = document.querySelector("meta[name='ajs-issue-key']");
    if (!metaTag)
        throw new Error("couldn't find the meta tag with the ticket id");
    const ticketId = metaTag.getAttribute("content");
    if (!ticketId)
        throw new Error("found the meta tag but couldn't get the ticket id");
    navigator.clipboard.writeText(ticketId);
    if (getDebugMode())
        console.log("copied the ticket id to the clipboard");
}

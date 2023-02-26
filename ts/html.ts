function get_ex_modalButton() {
	const html = `
<button id="ex_modalButton">
	<h3>&#9889</h3>
</button>`
	return html
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
			<div class="aui-dialog2-footer-hint"></div>
		</footer>
	</section>
</span>
<div aria-hidden="true" class="aui-blanket" tabindex="0" hidden=""></div>
`
	return html
}
function get_ex_expandCollapseButtons() {
	const html = `
<span id="ex_expandCollapseButtons">
	<button id="expandComments">expand all</button>
	<button id="collapseComments">collapse all</button>
</span>
`
	return html
}
function get_ex_copyTicketIdButton() {
	const html = `
<div id="ex_copyTicketIdButton" class="aui-buttons pluggable-ops">
	<a title="copy ticket id to clipboard" class="aui-button toolbar-trigger">
		<span class="trigger-label">Copy Ticket ID</span></a>
</div>
`
	return html
}

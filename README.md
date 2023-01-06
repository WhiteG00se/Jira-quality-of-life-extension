# Jira quality of life extension
currently still in beta, almost at the point where I will send it to google for review and to have it added to the chrome store

install the extension from the chrome web store:
https://chrome.google.com/webstore/category/extensions
(proper link coming soon)

# adds a button right side of the nav bar which opens the settings
# all features are disabled by default, the user can disable/enable them to their liking

# How to build the extension from source and install it in chrome
pre-requisites: node.js, typescript, chrome, git

1. clone the repo
2. transpile the typescript to javascript using the command `tsc` in the project root folder
3. open chrome://extensions/ and enable developer mode
4. drag the project folder into the extensions page
5. the extension should now be installed

# Jira quality of life extension
# only jira datacenter is supported, jira cloud is not

install the extension from the chrome web store:
https://chrome.google.com/webstore/category/extensions

adds a button right side of the nav bar which opens the settings
all features are disabled by default, the user can disable/enable them to their liking

How to build the extension from source and install it in chrome:
pre-requisites: node.js, typescript, chrome

1. open a terminal and navigate to the project root folder
2. transpile the source in /ts to /js/dist.js using the command `tsc`
3. open chrome://extensions/ and enable developer mode
4. drag the project folder into the extensions page
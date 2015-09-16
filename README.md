# Sample chrome extension with HeadHunter oAuth authorization

Inspired by https://developer.chrome.com/extensions/samples#search:oauth

**Proof of concept dirty prototype.**
**DO NOT USE IN PRODUCTION!**

## Usage

* register your app at https://dev.hh.ru/
 * set redirect uri like `chrome-extension://icbfgphlckfeacebkconifejbdkkafhi/`
* insert your client id & secret in background.js
* load unpacked extension in Chrome
* push hh button in extension actions
* extension will authorize you on hh.ru and display logged user info (`GET /me`)

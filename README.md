# FashionBuddy
This is the new repo for FashionBuddy that uses Ionic 4+

# System Settings
* NodeJS 12.7.0
* NPM 6.10.0
* Ionic Framework @ionic/angular 4.7.4
* Capacitor 1.1.1

# Getting Started
1. Clone the repo into your desired folder
2. Install node modules `npm install`
3. Run ionic environment `ionic serve`

# Troubleshooting
Err: `node sass module not found` Solution: `npm i node-sass`

# Best Practices
1. Before pushing code
    * Use a code formatter
    * Go through each file and verify that every change was intentional
    * Make sure all unit tests pass `ng test`
    * Verify that everything works as intended in test environment `ionic serve`
2. The less comments you need, the better. Use longer function names when necessary
3. When reusing custom angular components, be careful to only import them where necessary. We don't need a bunch of unused imports clogging up the system.
4. When installing node modules, make sure that there are no outdated mandatory peer dependencies
5. When building to devices for testing, use capacitor, not cordova `ionic capacitor run android/ios`

# Dev vs Prod
1. The Feature-Testing branch is a testing environment in itself and should NEVER be merged into master. For all intents and purposes, Feature-Testing is QA and master is Prod. NEVER build production from Feature-Testing!!
2. All configs are stored in the environments folder. To run in production, you must `enableprodmode()`
3. Building to devices for production/release should always be done from the master branch.

# Checking Pull Requests
1. Ensure that CircleCI build succeeds
2. Pull branch and verify unit tests pass `ng test
3. Must be approved by tech lead
4. All merges must go through the Feature-Testing branch before they can be implemented in master
5. All updates to master are done on the master branch through `git rebase Feature-Testing`

# Welcome
This is the new repo for FashionBuddy that uses Ionic 4+

# Getting Started
1. Clone this repo into a folder on your local machine, preferably `C:\<your-folder-name-here>` to avoid permission errors
2. `cd` into the Fashionbuddy folder within your custom folder
3. Run `npm install` to install all necessary node modules
4. Run `ionic serve` to start the Ionic web testing environment (native mobile features will not work, like camera)
5. You're all set! Features that need to be implemented are on the FashionBuddy Dev Project Board in GitHub

# Setup Troubleshooting
* Err: `npm is not a command` Solution: go here and download NodeJS https://nodejs.org/en/
* Err: `node sass module not found` Solution: Run `npm i node-sass`
* Err: `ionic is not a command` Solution: Run `npm i -g ionic`

# Working on New Features
1. Ensure you are on the `master` branch and run `git pull` and `npm install` to get the latest updates. If you get a permission error, try `sudo npm install` or `npm install -g`
2. Run `git checkout -b "<your-branch-name-here">` to start a new branch Ex: `git checkout -b "rewards-page-update"`
3. Now you are free to make any changes to the code
4. When you are happy with your progress, run `git add .` which stages all of your changes. 
5. Then run `git commit -m "<your-message-here>"` Ex: `git commit -m "Improved Page Load Times"`. This saves all the changes you made to your local git history and the message helps other developers know what changed when. Commit often.
6. If you type `git log` you can see all of the previous commits in the git history (press q to exit the git log)
7. Run `git push` to upload your branch to GitHub so that other developers can see your code
8. Run `git checkout master` to go back to `master` and start a new branch. Eat. Code. Sleep. Repeat.

# Merging New Features
1. Before making a pull request
    * If you installed node modules, make sure that there are no outdated mandatory peer dependencies
    * Use a code formatter. In VSCode the shortcut is `(Ctrl K + F)` to correct indentation and clean up line length
    * Go through each file and verify that every change was intentional. The less comments you need, the better. Use longer function names that are more specific
    * Verify that there are no unused imports
    * Verify that every feature works as intended in a test environment `ionic serve` (build on device when necessary)
    * Run `ng test` in the command line and verify that all tests pass
2. Make a pull request on GitHub. Make sure to set the base branch to `Feature-Testing`
3. Notify your tech lead that there is code to be reviewed

# How To Test on a Device
1. Cordova (recommended)
    * Android
        * Put device in developer mode
        * Enable USB debugging & plug in your phone
        * `ionic cordova run android` runs a development build on your phone, bypassing Android Studio
    * iOS
        * `ionic cordova build ios`
        * Open xcode WORKSPACE in XCode and run. You'll get an error if you open the xcodeproj
2. Capacitor (some native plugins may not work correctly? Capacitor is in beta)
     * Android
        * `ionic capacitor run android` builds and opens the project in Android Studio
     * iOS
        * `ionic capacitor run ios` builds and opens the project in XCode

# Troubleshooting
Err: `node sass module not found` Solution: `npm i node-sass`

# Merging Pull Requests (Tech Lead)
1. The `Feature-Testing` branch is a testing environment in itself and should NEVER be merged into `master`. For all intents and purposes, `Feature-Testing` is Dev and `master` is Prod. NEVER release a version of the app from `Feature-Testing`!!
2. Ensure that CircleCI build succeeds
3. Pull branch and verify unit tests pass `ng test`
4. All merges must be done on the `Feature-Testing` branch, not `master`
5. All updates to master are done on the master branch by running `git rebase Feature-Testing`

# Tools and Versions
* NodeJS 12.7.0
* NPM 6.10.0
* Ionic Framework @ionic/angular 4.7.4
* Capacitor 1.1.1
* Cordova 9.0.0

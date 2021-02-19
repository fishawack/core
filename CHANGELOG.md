## Changelog

### 5.2.0 (2021-02-19)
* [Change] Pinned firefox/chrome versions
* [Change] Sass now uses grunt built in file globbing
* [Docs] Changelog moved to standalone file

### 5.1.8
* Sass task now has include path config

### 5.1.7
* Set sass task up as a typical grunt multitask

### 5.1.6
* Prerender now has client side flag `window.prerender` which can be used to hydrate correctly
* Fix for sass task on windows

### 5.1.5
* Sass now uses Dart sass VM

### 5.1.4
* Svg options and tasks cleanup
* Svg's now build to `_Build/handlebars/generated`
* Fontello svgs now have asis variation

### 5.1.3
* Can now have level overrides in handlebars
* Can now have level overrides in javascript

### 5.1.2
* Env variables now update on watch
* Made webpack structure flat

### 5.1.1
* Can override/overwrite cordova config and/or platform settings

### 5.1.0
* Moved config structure to targets -> deploy
* SCP transfer limit raised
* Modernizr / Toggle / Template / GoogleTrackingID no longer required
* Email can now send even without a deploy target

### 5.0.2
* Updated scp command to fix bug with duplicate deploys going into nested folders

### 5.0.1
* Build id now gets added to handlebars object

### 5.0.0
* Deploys are now an object rather than 3 top level production/staging/qc. Means can have as many targets as needed
* Refactored deploy script
* Can now deploy via lftp mirror
* Postcss uncss now runs on production build regardless of branch
* Capture now longer prepends slash, this is added manually via pages object to make capturing history mode SPA's easier
* No longer remove from server on deploy, only ever a push
* asis flag now runs on all svgs allowing the flag to be used at any time
* Prerender no longer looks into the repo's client side javascript for array of pages, needs a file in _Node/prerender.js creating instead
* Removed casperjs, outdated and soon to be replaced by webdriverio which is already in the build for pdf's
* Cleaning _Output folder now does it from the root to take into account hidden files
* BrowserSync/grunt-connect now have history mode api enabled to allow for routing through index.html if no matching url found

### 4.12.2
* No longer pull content in on handover build to be consistent with other package types
* Correctly reset copy task in cegedim/veeva tasks

### 4.12.1
* Mail now correctly goes to the right account
* Package task now automatically packages handover package type

### 4.12.0
* New handover package type

### 4.11.7
* Bumped watertight to fix chrome SameSite setting

### 4.11.6
* Locked down core-js version to version 3
* Added proposals flag to core-js

### 4.11.5
* Bumped watertight to bring in new single login feature

### 4.11.4
* Set sourceType in webpack to "unambiguous"

### 4.11.3
* Phonegap now builds to newer folder structure in place of legacy structure
* Bumped cordova plugins
* Force WKViewView within cordova

### 4.11.2
* Default content schema now correctly allows anything
* Bumped watertight to now handle nested html folders

### 4.11.1
* _Resources werent in the files array in package.json

### 4.11.0
* Updated phonegap to allow platforms to be set
* Added dot to all copy commands

### 4.10.0
* Refactored schema importing and linting

### 4.9.4
* Fix for repoInfo so it doesn't fail if no remote exists
* `useBuiltIns` option now set to `usage` in the webpack config
* `.jshint` now set to `esversion: 10`
* Veeva resources are now part of the core repo and get bundled in automatically
* Single quotes around password in content pull to handle special characters

### 4.9.3
* Updated Cegedim package to generate `.jpg`'s instead of `.png`'s

### 4.9.2
* Package renamed to `core`

### 4.9.1
* Moved `package` before `deploy`
* Added catch blocks to pdf process
* Added timeout to curl

### 4.9.0
* Added vablet packaging
* Added cegedim packaging
* Added veeva packaging
* Moved dist/default to stand alone tasks so they can be overridden
* Added reset task
* Slug now part of capture image file names
* Added test suites for new packaging types
* The `cwd` will now be checked for `_Tasks/`
* The `cwd` will now be checked for `_Tasks/options`

### 4.8.9
* Change prepublish to preversion
* Added postversion to automatically publish
* Added missing test config files

### 4.8.8
* Added test suite to `core`
* Added prepublish and files array to `package.json`

### 4.8.7
* `uncss` bug fixed where it would only run against a single css file
* Added timeout option to `grunt-ftpscript` so that the badges command doesn't hang if not connected to vpn
* Added quotes around curl command so passwords with special characters don't fail
* Added a try / catch / `stdio:pipe` to curl command so if it fails it doesn't print the users creds
* Reordered the initial `contentJson` initialization so that contentJson can now handle `grunt.template.process` template strings

### 4.8.6
* Fixed postcss only running on master/qc, deployBranch -> deployTarget
* Repo info command now added to config
* Commands now use repo.name rather than title, solves issues with special charts in titles breaking build processes
* Some badges now pulled from internal server to solve gitlab pages not having a persist option
* The `repo` property in contentJson is now completely unused, left it in the schema for now as to not break existing builds

### 4.8.5
* Cachebust fix for new subfolder feature

### 4.8.4
* Html folder can now contain subfolders which will pull through to the front end

### 4.8.3
* Moved svg tasks to after webpack

### 4.8.2
* Added svg loader to webpack

### 4.8.1
* Point to svgs for badges

### 4.8.0
* Added regression testing

### 4.7.6
* Handlebars now has access to `env` properties
* Handlebars now has access to `pkg` properties
* Updated `_Tasks/options/env.js` to be the single source of env variables

### 4.7.5
* Moved `fs-extra` remove call so as to not interfere with the mirror command of lftp
* Changed order of requests so all requests run before rewrites start

### 4.7.4
* Removed an `rm -rf` that was causing issues on windows, replaced for `fs-extra` remove

### 4.7.3
* Content request now pulls videos aswell as images
* Content request no uses pLimit

### 4.7.2
* Bumped watertight to `5.0.7`

### 4.7.1
* Bumped watertight to `5.0.6`

### 4.7.0
* `process.env.NODE_TARGET` now set to development when on any other branch rather than staging
* Postcss runs on all branches apart from development/feature branches
* Prerender now fails fatally if the loaded scenario doesn't fire
* CMS no longer hangs when there's 0 media assets on the cms
* Prerender can now be set per deploy target as well as globally 

### 4.6.0
* Reversed `4.4.10` change so that uncss only runs on `qc` and `master` so that feature branches also benefit from the speed boost
* Prerender now available as an option in `content.json`
* `content-request` now also pulls media assets

### 4.5.3
* Bumped `modernizr` as old version now 404's on fresh `npm install`

### 4.5.2
* Fix for `4.5.1` bad publish

### 4.5.1
* Fixed bug in schema for `toggle`

### 4.5.0
* Fixed bug in `login-form`

### 4.4.13
* Added docs for `login-form` implementation.
* Updated `login-form` so the file can be pulled from anywhere not just `_Build`
* Fixed bug in `compile-handlebars` where it wouldn't ignore any underscore template files found in the `html` folder

### 4.4.12
* Bumped watertight to `v5.0.5`

### 4.4.11
* Can now specific `url` and `wait` propertys on pdf

### 4.4.10
* Uncss no longer runs on `development` branch

### 4.4.9
* When deploying the folder is no longer completely wiped, it will only remove files it knows about

### 4.4.8
* Added a .githook for edge case with stream folder structure

### 4.4.7
* Updated .githook to new `level-0` format

### 4.4.6
* Bades now generate on `npm run validate`
* Can now have query strings in pdf routes

### 4.4.5
* Email task now checks for `staging` along with the other standard branches

### 4.4.4
* Fixed bug in gitlog on generated email

### 4.4.3
* Fixed bug where error was being thrown if the `env` object was missing from the root of the instance.json

### 4.4.2
* Changed `compare` task to run synchronously due to memory issues when trying to compare large sets of images

### 4.4.1
* .githooks now packaged rather than being duplicated in each repo
* The config merging has been overhauled

### 4.4.0
* `npm run setup` now uses `npm ci` instead of `npm install --no-save`

### 4.3.7
* Remove support for node v12 for now, causing knock on issues so rolled back some dependancies

### 4.3.6
* Made default email point back to `digital@f-grp.com`

### 4.3.5
* `email` in `content.json` can now be applied to deploy target and will be merged with any top level emails

### 4.3.4
* Bumped dependancies to support Node v12
* Added `package-lock.json` file

### 4.3.3
* Added first iteration of visual regression / browser difference testing

### 4.3.2
* Fix for strange `svg-sprite` issue where if there are enough svg's and the `#ga` id is used the GTM would inconsistenly fail
* Bumped `svg_sprite` to point at fork until it's merged into npm package.

### 4.3.1
* Use `watertight-node-auto` v4.0.3

### 4.3.0
* Pdf generation overhauled to allow multiple sizes and multiple browsers

### 4.2.4
* Bumped `grunt-svg-sprite` as it suddenly started throwin an error `Cannot read property 'distribute' of undefined`

### 4.2.3
* Fixed lftp bug that occurred when running content pulls on linux machines

### 4.2.2
* Added `preserveWhitespace: false` to `vue-loader` to remove whitespace in the rendered vue templates

### 4.2.1
* Added an "auto confirm" to the lftp command to stop it failing on first use

### 4.2.0
* Changed the structure of pulled folders, each folder now goes into it's own directory and merged at build time
* Grunt tasks start much faster as `requires` aren't pulled in until needed
* Bumped `node-sass` and `grunt-sass` to latest versions
* `node-sass` now saves to `.tmp` before postcss then processes and saves it to `_Output`
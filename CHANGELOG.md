## Changelog

### 7.21.1 (2022-06-16)
* [Bug] Fix to config.root so that it can be called as a standalone from ui tests
* [Misc] Can pass mocha fixture to node api

### 7.21.0 (2022-05-27)
* [Feature] Twig/Blade files are now processed during the purgecss task
* [Feature] Capturing will now glob all html files found in the root folder if no explicit pages property is passed
* [Docs] Uglify troubleshooting
* [Docs] Prerendering issues with app id

### 7.20.0 (2022-05-27)
* [Feature] Can now invalidate AWS cloudfront distributions

### 7.19.0 (2022-05-27)
* [Feature] Can now deploy to AWS s3

### 7.18.0 (2022-04-26)
* [Change] Prerender now async awaits each render for better memory consumption and logging
* [Misc] Test suite for prerender

### 7.17.0 (2022-04-19)
* [Feature] Can now specifiy the boolean https in devServer options in fw configs
* [Change] Content pulls are now done with internal lftp module - the only difference is it is now non destructive (missing -e flag)

### 7.16.0 (2022-04-01)
* [Feature] Example configs can now be defined as level-0.example.config and work the same as examples in /example folder
* [Bug] Veeva shared resources now generate a dummy index.html & thumb.png
* [Misc] Test suite for veeva shared resources
* [Docs] Added svgSprite migration guide
* [Docs] Added troubleshooting for Docker Composer v2

### 7.15.0 (2022-03-21)
* [Change] Office365 credentials are now used instead of gmail for auto deployment emails
* [Change] Artifacts attached to emails are now uploaded to egynte rather than the internal eSource server
* [Change] Artifacts attached to emails no longer link directly to the file but rather to the containing folder on egnyte
* [Change] Package tasks no longer clean the .tmp location after running
* [Change] Mail checks for app flag before adding app zip package to html email
* [Change] Clean zips task now cleans from root
* [Change] Artifacts now split into a dedicated task
* [Change] Regular app packages are now behind an app flag rather than being default on with no option to turn off
* [Bug] Show unversioned when creating filepaths with no version present in package.json
* [Bug] Veeva task now checks for empty screenshot and shows an appropriate error message
* [Bug] Handover task now checks if package.json scripts exist before trying to remove them
* [Bug] Purgecss now runs again on branches that have deploy properties but not a deploy location itself
* [Misc] Migration guide for gitlab-ci.yml versions
* [Misc] Migration guide for package.json script update in core@7.5.0 which breaks manually ran scripts
* [Misc] Mail task logs html email to file when running tests
* [Misc] Test suite for mail
* [Misc] Test suite for package
* [Misc] Test suite for purgecss
* [Misc] Test suite for artifacts

### 7.14.2 (2022-03-15)
* [Bug] Locked yargs version to fix issue with minor version bump of main package

### 7.14.1 (2022-02-01)
* [Bug] Fixed bug in symlinks.resolve when using an array of paths
* [Misc] Test suite for copy:deploy with paths array

### 7.14.0 (2022-01-31)
* [Feature] Content requests can now be overridden for other CMS's but still defaults to wordpress properties
* [Change] content task is now split into content:request and content:pull
* [Change] Updated schema for now content-request properties (api, find)
* [Change] Moved to async/await approach for content-request to simplify callbacks
* [Change] Rewriting endpoints now done via regex
* [Bug] Content request url joins are now all normalized so trailing slashes don't cause problems
* [Misc] Test suite for content-request

### 7.13.1 (2021-12-21)
* [Bug] Fixed an issue with symlinks not resolving or copying correctly when found outside of the package location

### 7.13.0 (2021-12-06)
* [Change] Aws eb env property now removed in favor of a single aws-eb property for both profile and env

### 7.12.0 (2021-12-06)
* [Feature] Can now specify the environment that aws eb should deploy to in config

### 7.11.1 (2021-12-06)
* [Bug] Compress command no longer attempts to zip when no files are globbed

### 7.11.0 (2021-12-06)
* [Feature] New property `symlinks` on the compress task that maps to `zip -y` in bash to keep symlinks
* [Change] Removed `grunt-contrib-compress` package
* [Change] Wrote a custom compress task that mirrors the previous task exactly
* [Misc] New tests for compress task

### 7.10.0 (2021-12-03)
* [Feature] Can now deploy via through eb cli
* [Feature] Can now set null on commands to invalidate any globally set ones
* [Feature] Server commands both pre and post can now be handled by eb ssh
* [Change] A zip file of the _Deploy package folder is now generated
* [Bug] Correctly remove the _Watertight package folder

### 7.9.0 (2021-11-26)
* [Change] Switch back to execSync's for lftp commands but now with -d flag removed for more concise output

### 7.8.0 (2021-11-26)
* [Change] deploy task now a simple array that fires deploy:files and the post/pre commands
* [Change] deploy:server:pre now runs mkdir -p incase the repo doesn't yet exist on the remote
* [Change] When deploying check if username and host also exist as well as location
* [Change] takedown command also checks for valid deploy target
* [Change] Bumped watertight to `5.1.2`
* [Change] No longer run mkdir /logs on watertight deployments as thats now done by watertight itself
* [Change] ssh/scp deploys now also use the spinner function
* [Misc] Added tests for more deploys and deploy commands locally and on the server
* [Misc] When mocha tests run manually all output is inherited, when run as part of the publish its piped

### 7.7.0 (2021-11-16)
* [Change] lftp commands now utilize a spinner as not to overwhelm CI/CD logs

### 7.6.0 (2021-11-09)
* [Change] Can now override all aspects of the capture code

### 7.5.3 (2021-11-03)
* [Bug] Added follow:true on shared resource expand object so that files are correctly imported

### 7.5.2 (2021-11-01)
* [Bug] String replace the loading/loaded class on prerender to avoid bug of jsdom step not having the prerender inject scripts that the prerender step has

### 7.5.1 (2021-07-23)
* [Change] npm commands now only run for a single purpose, commands will need chaining for full deployments

### 7.5.0 (2021-07-23)
* [Change] npm commands now only run for a single purpose, commands will need chaining for full deployments
* [Change] Branch now checks for environment variables before using the git package to determine branch

### 7.4.0 (2021-07-22)
* [Feature] Can now specify deploy paths and commands to run both locally and on the server pre and post deploy
* [Change] The deployEnv variable is now the merged variable instead of the direct one

### 7.3.1 (2021-07-16)
* [Bug] Handle errors on compare step
* [Bug] Clear cache on dist builds

### 7.3.0 (2021-07-07)
* [Feature] Can now specify transpile option to force transpilation of defined node_modules
* [Bug] Move phonegap consts so they don't throw errors if phonegap not defined

### 7.2.1 (2021-06-28)
* [Bug] Removed fields from schema that no longer exist

### 7.2.0 (2021-06-28)
* [Change] Now that phonegap build is discontinued, switched to cordova cli implementation for packaging

### 7.1.1 (2021-06-11)
* [Bug] Capture size that matches 375x667 will now trigger mobileEmulation

### 7.1.0 (2021-06-08)
* [Change] validTo/group no longer required for users in config

### 7.0.1 (2021-06-08)
* [Bug] Password used instead of passphrase in lftp command
* [Bug] Quotes around paths in lftp to fix issues with special chars and spaces

### 7.0.0 (2021-06-02)
* [Feature] Dist builds can now be triggered by the dist task or a dist options flag
* [Change] Switched from uncss to purgecss
* [Change] Removed compile-vue task from watch and build tasks

### 6.2.1 (2021-06-01)
* [Bug] Fixed issue where pdf generation was ignoring sizes
* [Bug] Fixed vue cache clear and removed nested grunt task as unsupported in grunt

### 6.2.0 (2021-05-20)
* [Change] Postcss and concat now run as part of the full sass process rather than separate grunt tasks
* [Change] Uncss in contentJson now redundant
* [Change] Removed gruntpostcss dep and bumped base postcss dep

### 6.1.0 (2021-05-18)
* [Feature] Can now have a shared resources media folder which will be turned into a stand alone zip file if the corresponding flag is set on a veeva package
* [Change] Resolve postcss assets from the root of the dist folder rather than the media folder
* [Change] copy:content now no longer run as part of the content command as it runs anyway during build

### 6.0.0 (2021-04-30)
* [Feature] Postcss now caches and only reloads whats changed
* [Change] Sass now manages its own watch resulting in speed improvements

### 5.12.0 (2021-04-27)
* [Feature] BrowserSync ports will now automatically map if any env ports are found
* [Feature] Can now override the default source directory
* [Docs] Update on scss code highlighting

### 5.11.0 (2021-04-22)
* [Feature] Unit tests can now be placed in a _Test/unit folder
* [Feature] Can now have a vendor.scss file that will automatically be combined with general.scss
* [Change] Karma unit tests are no longer run as part of the main build commmand
* [Change] Karma unit tests are no longer run on the watch
* [Change] Clean the .cache folder on first build


### 5.10.0 (2021-04-21)
* [Feature] Can now have Ui tests that run via webdriverio
* [Docs] Pdf documentation updates

### 5.9.0 (2021-04-09)
* [Feature] Can now have veeva state field and object to specific which database fields to store state against
* [Change] Bumped the veeva framework code and manually updated a few lines to stop it throwing errors if anything else uses postMessage function
* [Change] Removed dupe key messages in the cegedim and veeva task and moved them to shared include.js
* [Change] initConfig now comes before the external include call

### 5.8.1 (2021-03-24)
* [Bug] Append the branch name to any generated files to stop files overwriting each other if the same package type specified for multiple branches

### 5.8.0 (2021-03-23)
* [Change] Put handover package type behind a handover property in the config
* [Bug] Updated tests to correctly check for empty array
* [Bug] Fixed issue in compare function that was throwing an error

### 5.7.0 (2021-03-22)
* [Change] Pdf options now moved to capture object, this allows for pdf specific code in capture.js

### 5.6.0 (2021-03-22)
* [Change] Optimized pdf/capture process to only once

### 5.5.0 (2021-03-19)
* [Change] Date on veeva end and start now validated
* [Change] Make titles safe strings before adding to MCL

### 5.4.1 (2021-03-15)
* [Bug] Removed duplicate multi channel loader column

### 5.4.0 (2021-03-12)
* [Feature] Can now have level specific capture code
* [Bug] No longer fails to pull from CMS if there's a trailing slash in the url
* [Bug] Correctly return promises in `content-request` to avoid runaway promise resolution

### 5.3.0 (2021-03-05)
* [Feature] Can now set the disabled actions in veeva MCL
* [Change] Schema's now written to hidden `.cache` folder to fix issue with node_modules now being in docker volumes

### 5.2.2 (2021-02-20)
* [Change] Veeva MCL iOS resolution changed from `Scale to Fit` to `Default For Device`

### 5.2.1 (2021-02-19)
* [Feature] Veeva builds now publish a Multichannel loader packaged inside the zip file

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
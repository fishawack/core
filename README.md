## Background

### What

This repo contains the code that fetches assets, bundles code and deploys it to the server.

### Why

As a company we do a lot of smaller short term builds rather than longer term code bases. To keep code bases small we create many smaller repo's rather than branching projects in a larger monorepo. For this reason we ended up with lots of duplicate task runner code in each repo that had to be manually updated if any projects came back from the dead further down the line. Around 2014 all of that code was pulled to a shared npm module which meant a massive reduction in code repetition throughout all of our code bases.

## Dependancies

> With the release of lab-env all of these dependencies can now be handled through containerization so no longer need to be manually installed. Check the [install guide](#lab-env) on how to get started.

As this code base is shared amongst most of our repos, these dependancies are likely the only ones you'll ever need to install to get project code up and running. They've been split into three groups, content, build and deploy dependancies.

### Content

The following dependancies are needed to pull binary assets from external sources.

> Repositories packaged for handover to external agencies won't need these dependencies as binary files (png's,mp4's etc) will be baked into the final repository

* [lftp](https://lftp.yar.ru/)

### Build

The following dependancies are needed to build the source code in both development mode and production.

* [git](https://git-scm.com/) (>=2.38.0 recommended)
* [node](https://nodejs.org/en/) (>=16 recommended)
* [npm](https://www.npmjs.com/) (>=9 recommended)
* [dart sass](https://sass-lang.com/dart-sass) (>=1.57.1 recommended)

### Deploy

These dependancies are only needed if you're planning to run Fishawack specific deployments or generate packages.

> Repositories packaged for handover to external agencies won't need these dependencies

* [ghostscript](https://www.ghostscript.com/)
* [wine](https://www.winehq.org/)
* [chromium](https://www.chromium.org/)
* [eb cli](https://github.com/aws/aws-elastic-beanstalk-cli-setup/tree/v0.1.2)
* [aws cli](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html)
* [electron-packager](https://github.com/electron/electron-packager)
* [git-branch](https://github.com/jonschlinkert/git-branch)

## Getting started

### Mac

* Install brew - [http://brew.sh/](http://brew.sh/) - then run the following commands

```bash
brew install git
brew install sass/sass/sass
brew install lftp
brew install ghostscript
brew install wine-stable
brew install aws-elasticbeanstalk
brew install awscli
brew install chromium
```

* Install Nvm - [https://github.com/creationix/nvm](https://github.com/creationix/nvm) - then run the following commands

```bash
nvm install 18.0.0

npm install npm@latest -g
npm install electron-packager -g
npm install git-branch -g
npm install install -g git+ssh://git@bitbucket.org/fishawackdigital/watertight-node-auto.git#v6.0.0
```

## Remotes

We currently utilize two remotes for our git versioning. The externally facing bitbucket allows freelancers to contribute to our repositories whilst our internally facing gitlab allows our CI/CD to gain a bunch of security advantages just by the fact that it is inherently on the internal network.

### Cloning

Repo's **should only ever be cloned from Bitbucket**. 

Gitlab should be viewed purely a supporting remote used primarily for the CI/CD and **should never be used for forking/cloning** under any circumstances. 

**The single source of truth is Bitbucket.**

After cloning a repo you have to run the `origin` command on the terminal which will correctly set the `origin` to point to both remotes. If you don't currently have the origin command you need to [add it](#core-remotes-origin).

> The reason `origin` isn't part of the `npm run setup` command is because this would throw an error on any freelancers machine trying to connect to gitlab

### Githooks

We need to update the githooks property in our global config to point to the hooks folder found in `core`. To do this run the following command.

```bash
git config --global core.hooksPath node_modules/@fishawack/core/.githooks
```

## Commands

> When using [lab-env](#lab-env) these commands should be switched out for their [lab-env](#lab-env-commands) equivalent. Run `fw --help` to get a full list of commands.

Regardless of what the repo uses under the hood the following commands should be the only commands needed when interacting with a repo.

### Setup

Runs all install scripts needed to build the repo and lastly runs `npm run content` to pull down assets.

```bash
npm run setup
```
### Build (watch)

Bundle's the code and begins the watch task ready for development.

```bash
npm start
```

### Content

Pulls any assets from the server and any json endpoints that are needed locally.

```bash
npm run content
```

### Test

Runs smoke/unit/build tests and linters.

```bash
npm test
```

### Production

Bundles the app in production mode.

```bash
npm run production
```

### Deploy

Transfers the build to a server based on which branch you're currently on.

```bash
npm run deploy
```

This command is branch dependant. Check the config in the repo to see if any deployment targets have been setup for the branch your currently on. If none have then this command **won't** deploy anywhere but will still prepare the bundle in production mode and create a local zip package.

## Credentials

> [lab-env](#lab-env) has a command to help populate these credential files by running `fw diagnose`.

Credentials are needed in the root of each project so that the automated scripts can properly deploy and fetch content from the server. To mitigate the need to manually copy credentials each time we create a folder on the root of each individuals machine that contains their unique creds. The automated script will automatically grab the `id_rsa` found in the default location in `~/.ssh/`. It will then grab any `secret.json` files it needs for which ever server the current project needs to be deployed onto. If it can't find the correct `secret.json` for a server it will silently fail.

> For the automated scripts to work only 1 id_rsa can exist on a persons machine. If you plan on using multiple then you'll need to manually copy credentials as it won't know which id_rsa to use

### Target folder

Create the target folder in the root of the machine by running the following command.

```bash
mkdir ~/targets
```

There are three types of file that can be found here.

> Remember to add your own usernames and passwords to these files or grab the global ones from the passwords doc

> Make sure to remove the comments from these files

#### `.ftppass`

This file is used for ftp/sftp/ftps/lftp details. All details go into this single file in the following format 

```json
{
    // Poundhost box, DEPRECATED
    "213.229.71.134": {
        "username": "",
        "password": ""
    },
    // eSource box, DEPRECATED
    "10.1.8.4": {
        "username": "",
        "password": ""
    },
    // Windows QR code box, DEPRECATED
    "185.96.94.153": {
        "username": "",
        "password": ""
    },
    // Fishawack veeva sandbox
    "crm-13-ftp-us.veevacrm.com": {
        "username": "",
        "password": ""
    },
    // Egnyte
    "ftp-fishawack.egnyte.com": {
        "username": "",
        "password": ""
    }
}
```

#### `misc.json`

This file contains miscellaneous details for various systems across the whole tech stack. 

```json
{
    // Deploy emails
    "nodemailer": {
        "username": "",
        "password": ""
    },
    // Push/fetching from phonegap
    "phonegap": {
        "token": ""
    },
    // Various gitlab api reuqests
    "gitlab": {
        "token": ""
    },
    // Various bitbucket api requests
    "bitbucket": {
        "username": "",
        "password": ""
    }
}
```

#### `secret.json`

These files are used to store ssh credentials for the respective servers the files are named after. If you're not doing manual deploys then you don't need these files as the repo will silently fail if they're missing.

When creating the file the name needs to match the server name, here are some examples of servers and their respective secret file and json content.

* `dumbledore.json`
* `vidaHost-fishawack.json`
* `vidaHost-meeting.json`

```json
{
    "host" : "172.16.8.21",
    "username" : "",
    "password" : "",
    "passphrase": ""
}
```

> Make sure you've successfully ssh'd into each box before attempting to deploy manually as the machines ip needs adding to the authorized_keys file on the server itself

## Config

### Structure

One of the most important files in any project is the config file. It contains the deploy targets, content locations and sometimes even the textual content for the project itself.

This file can be constructed from multiple config files using a deep merge. This allows for instance specific configs to be merged with shared theme configs and even base configs.

The files are merged in order of the following locations, afterwhich they are merged alphabetically in the location itself.

```bash
'*.json',
'_Build/config/*.json',
'_Build/*.json'
```

Example configs found in either the _Build/config/example folder or specified in the filename i.e. fw.example.json will only be used if the config with the same name doesn't exist.

```bash
# Example 1
fw.json
fw.example.json # will be ignored

# Example 2
level-0.json
level-0.example.json # will be ignored
level-1.example.json # will be loaded

# Example 3
_Build/config/level-0.json
_Build/config/example/level-0.json # will be ignored
_Build/config/example/level-1.json # will be loaded
```

> For backwards compatability `_Build/content.json` and `_Build/example/content.json` work the same as they always did but these should be replaced with `_Build/instance.json` and `_Build/config/example/*.json` respectively.

```json
// _Build/config/theme.json
{
    "attributes": {
        "title": "Base",
        "root": "_Output",
        "modernizr": [
            "csscalc"
        ]
    }
}

// _Build/instance.json
{
    "attributes": {
        "title": "Instance",
        "googleTrackingID": "test",
        "modernizr": [
            "flex"
        ]
    }
}

// Final merged config
{
    "attributes": {
        "title": "Instance",
        "root": "_Output",
        "googleTrackingID": "test",
        "modernizr": [
            "csscalc",
            "flex"
        ]
    }
}
```

### VSCode intellisense

If using VSCode you can add the following snippet to your json schema settings to get full json intellisense for both the configs and STREAM projects.

```bash
Preferences > Settings > JSON:Schemas > Edit in settings.json
```

And add the following property and values;

```json
"json.schemas": [
    {
        "fileMatch": [
            "/fw.json",
            "/_Build/content.json",
            "/_Build/config/*.json",
            "/_Build/config/**.*.json"
        ],
        "url": "/.cache/schema/schema.json"
    },
    {
        "fileMatch": [
            "/_Build/sequences/*.json",
            "/_Build/sequences/**/*.json"
        ],
        "url": "/.cache/schema/sequence/schema.json"
    }
]
```

## Assets

We currently keep our binary assets on our fishawack file sharing platform egnyte. Previously we had an onsite server that was used but that has now been deprecated, this doesn't mean you won't still run across repo's using the previous location so it's worth knowing about.

**Current location**
* Name: Egnyte
* Protocol: `[ftps,lftp]`
* Path: `Shared/FW/Knutsford/Digital/Auto-Content/`
* IP: `ftp-fishawack.egnyte.com`

**Old location**
* Name: eSource box
* Protocol: `ftp`
* Path: `Auto-Content/`
* IP: `10.1.8.4`

The `Auto-Content` folder contains folders with the same names as the repo names in bitbucket. Some products have a parent folder e.g. `Wave` that contains all waves as not to clutter up the `Auto-Content` folder with instances.

The json that dictates which asset folders are pulled can be found in the [config files](#core-config).

```json
{
    "attributes": {
        ...
        "content": [
            {
                "lftp": "ftp-fishawack.egnyte.com",
                "location": "Shared/FW/Knutsford/Digital/Auto-Content/arbor-scroll/"
            },
            {
                "ftp": "10.1.8.4",
                "location": "Auto-Content/arbor-scroll/"
            }
        ],
        ...
    }
}
```

### Media folder

Inside the repo named folder you will usually find a media folder. Any files inside this media folder will get pulled through and be available to the front end via image tags / sass resolves. Anything outside the media folder will still get pulled into the repo but won't be included in the front end bundled files. The primary use case for this are excel files / pre process files that are used in the build phase but not needed in the final site.

Here is a common structure you're likely to see in the Auto-Content location.

```bash
.../Auto-Content/myapp/media/images/background.jpg
.../Auto-Content/myapp/media/fonts/Roboto.woff
.../Auto-Content/myapp/media/videos/video.webm
.../Auto-Content/myapp/data/piechart.xls
```

All the above assets will be pulled through to the repo but only the ones found in the media folder will be available to the front end.

When pulled into the build all files are saved to the `_Build/content/` folder which is ignored by git.

### Binary

All binary assets (jpg,png,mp4) should **not** be kept in version control. Not only was git not really designed for these types of files but they can also greatly inflate the size of a repo. These are the files that should be kept on the file sharing servers and pulled into the repo via file transfers.

Though the media files are placed in the git ignored `_Build/content/media` when pulled from the server, they are placed in `_Output/media/content` when copied to the `_Output` folder. Note the `media` and `content` folders are flipped in the final output folder so image tags need to reflect this.

> Be sure to use relative paths when referencing assets. If an absolute url is needed it should be done with a `<base href="/"/>` tag.

```html
<!-- Bad -->
<img src="content/media/images/background.jpg">

<!-- Good -->
<img src="media/content/images/background.jpg">
```

### Non binary

Non binary assets (json,svg,xml) should be kept in version control by being placed into `_Build/media/` location in the source code. This folder **is tracked** by git but will generally be empty as most assets are binary assets that get pulled in from the server.

## Javascript

All js files should be kept in `_Build/js/`.

The default entry point is `script.js` which is automatically requested in the body of the default html.

### Multiple entry points

To create another entry point simply create a new javascript file and prefix it with a double hyphen `--`. A file with the same name excluding the hypens will then be generated in the `_Output` folder.

> Remember to include the script tag in the html to import this new file

```bash
_Build/js/--newEntry.js   >>   _Output/js/newEntry.js
```

### Imports

Both es6 imports and CommonJS imports are supported. When requiring a javascript file that doesn't contain a default es6 export you need to specify the default property on the returned object.

```js
// Bad
var lib = require('es6-file-with-no-default-export.js');

// Good
var lib = require('es6-file-with-no-default-export.js').default;
```

### Crucial

Not so important anymore (any maybe deprecated soon) but any file that needs to be included in the head of the document and thus before the rest of the document is ready should be defined with a double underscore `__`. The primary use case for this is modernizr which according to the docs should be imported in the head of the document before the other scripts have run. Modernizr itself has its own workflow outlined elsewhere in this documentation.

```bash
_Build/js/__important.js   >>   _Output/js/crucial.js
```

### Enviroment variables

Within the javascript you can use node style enviroment variables which will be proccessed during the bundling and rendered to static strings in the final output.

#### Source
```js
if(process.env.NODE_ENV === "development")
```

#### Output
```js
if("development" === "development")
```

#### Predefined

These variables are predefined and are automatically avaiable to use.

```js
process.env.NODE_ENV === "development" // when running development build
process.env.NODE_ENV === "production" // when running distribution build

process.env.NODE_TARGET === "production" // when on production branch
process.env.NODE_TARGET === "qc" // when on qc branch
process.env.NODE_TARGET === "staging" // when on staging branch
process.env.NODE_TARGET === "development" // when on development branch
```

#### Custom

Custom enviroment varibles can be defined globally in the [config files](#core-config).

```json
{
    "attributes": {
        ...
        "env": {
            "CONTENT": "./arbor-2018"
        },
        ...
    }
}
```

```js
process.env.CONTENT === "./arbor-2018"
```

You can also define custom enviroment variables per target that will override global ones.

```json
{
    "attributes": {
        ...
        "staging": {
            ...
            "env": {
                "CONTENT": "./staging-arbor-2018"
            }
        }
        "env": {
            "CONTENT": "./arbor-2018"
        },
        ...
    }
}
```

```js
process.env.CONTENT === "./staging-arbor-2018"
```

### Linting

JSHint is used to lint against all javascript files in the `_Build/js/` folder excluding those found in `_Build/js/libs/`. This purpose of this folder is to drop any scripts that aren't authored by ourselves and therefore don't need to adhere to our linting as they likely used their own. This again isn't so important anymore as most js libraries will be imported from `node_modules` but if you do have the actual file and need it locally in the repo then this folder is where you'd put it.

## Css

All sass files should be kept in `_Build/sass/`.

The default entry point is `general.scss` which is automatically requested in the head of the default html.

### Multiple entry points

To create another entry point simply create a new sass file and exclude the standard sass underscore `_` prefix. A file with the same name will be generated in the `_Output` folder.

> Remember to include the link tag in the html to import this new file

```bash
_Build/sass/newEntry.scss   >>   _Output/css/newEntry.css
```

### Auto-prefixing

You **don't** need to prefix any css properties with browser prefixes as the bundler will automatically apply them based on the latest browser version.

#### Source
```scss
.class1{
    appearance: none;
}
```

#### Output
```scss
.class1{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
```

### Vendor imports

Keeping all custom sass imports mixed with large vendor imports can result in very slow compile times. To combat this you can specify a special entry point named `vendor.scss` at the same location as the regular entrypoint `general.scss`. This file works like any other scss entry file aside from it automatically getting combined with `general.scss` during the build resulting in the same single css file `_Output/css/general.css` needing to be imported via html.

This file should be used to import any large 3rd party libraries or code that doesn't often change, that way your compile speed on the code you modify frequently will remain fast.


Check [lab-ui documentation](#lab-ui-getting-started) for an example of the folder structure needed to make this work.

### Unused

Classes that aren't present in any html,vue or php files **before** javascript runs are considered redundant and are removed from the final bundled css file.

#### Html
```html
<div class="class1"></div>
```

#### Sass
```scss
// Will appear in final css file
.class1{
    ...
}

// Will be removed from final css file
.class2{
    ...
}
```

#### Whitelist

There are a few keywords that are globally whitelisted from being stripped from the css.

#### `.active / .deactive`

These two classes are the only two classes that should be added/removed via javascript. There aren't many use cases where anything more than a default state, an **on** state and an explicit **off** state are needed.

```js
// Bad
document.querySelector('.button').classList.add('button--on');

// Good
document.querySelector('.button').classList.add('active');
```

#### `.capture`

They'll be more on this in the pdf section of this documentation but when the pdf process is happening there is a global `.capture` class added to the root of the document. This is so things like animations/transitions can be turned off where needed so the pdf can capture correctly.

```scss
.animatedThing{
    color: red;
    transition: color 0.2s;

    .capture &{
        transition: none;
    }
}
```

#### `.labD3`

This class is used to prefix all classes added through our dynamic d3 data visualization library. This class in its very nature is all javascript driven and thus the need to create an immune prefix for use throughout.

### Resolving assets

When pulling in assets via css the `resolve` postcss process should be used in place of the standard `url`. This is due to some products needed to package themselves different for different deliveries, this causes the project structure to change and therefore the asset paths are different. By allowing resolve to calculate the asset path this issue can be mitigated.

```scss
// Bad
.class1{
    background-image: url("./media/images/background.jpg");    
}

// Good
.class1{
    background-image: resolve("background.jpg");
}
```

## Html

The default entry point for html is `_Build/index.html`. 

Any html found in the root of `_Build/` or in `_Build/html/` will generate a corresponding html file in the root of the `_Output` folder.

#### Build 
```bash
_Build/index.html
_Build/contact.html
_Build/html/404.html
_Build/html/login.html
```

#### Output
```bash
_Output/index.html
_Output/contact.html
_Output/404.html
_Output/login.html
```

### Dynamic pages

<< TODO: section about attributes.template property and dynamic html files >>

### Handlebars

The html uses [handlebars](https://handlebarsjs.com/) evaluated at pre-process time as a templating language. This is completely fine to use alongside a runtime templating language like Vue where the handlebars will simply be used for the global boilerplate html.

Handlebar partials and helpers can be found in `_Build/handlebars`.

## Svg

### Optimization

Svg files found in the following locations go through the optimization process.

```bash
_Build/svg/
_Build/icons/generated/
```

There are different levels of optimization that svg's go through dictated by the prefix found before the filename.

#### No prefix

Will have all properties and strokes stripped leaving only the shape. Will also combine any paths or shapes that intersect.

```bash
menu.svg
```

#### Double hyphen

Will have only non vital properties stripped but should retain it's appearance/colors/fills.

```bash
--menu.svg
```

#### Double underscore

Same as the double hyphen but these svg's **aren't** added to the global [sprite sheet](#core-svg-sprite-sheet)

```bash
__menu.svg
```

### Sprite sheet

The sprite sheet should generally contain simple shapes that are shared across the site generally icons and logos. It is usually imported by handlebars in the body of the page.

#### Handlebars
```handlebars
<!doctype html>
<html>
    ...
    <body>
        {{> svgSprite}}

        ...
    </body>
</html>
```

To include an svg from the sprite sheet do one of the following.

#### Handlebars
```handlebars
<!-- Full optimization -->
{{> svg name="menu"}}

<!-- Minimal optimization -->
{{> svg name="--logo"}}

<!-- Error - not included in the sprite sheet -->
{{> svg name="__figure"}}
```

#### Vue
```handlebars
<!-- Full optimization -->
<GSvg name="menu"/>

<!-- Minimal optimization -->
<GSvg name="--logo"/>

<!-- Error - not included in the sprite sheet -->
<GSvg name="__figure"/>
```

### Embedding

If direct access to the svg inner elements is needed then the svg will need embedding in the page.

> If an svg is **only** ever going to be embedded make sure not to accidentally use the `--` double hyphen prefix instead of the `__` double underscore. Doing this will unnecessarily inflate the sprite sheet.

To embed a file directly in the html markup do one of the following.

#### Handlebars
```handlebars
<!-- Full optimization -->
{{> svg name="menu" embed=true}}

<!-- Minimal optimization -->
{{> svg name="--logo" embed=true}}

<!-- Minimal optimization -->
{{> svg name="__figure" embed=true}}
```

If the optimization is still causing issues and you want the **original** svg markup embedding you can do the following

```handlebars
{{> svg name="menu" embed=true asis=true}}
```

#### Vue

```handlebars
<!-- Full optimization -->
<GSvg name="menu" embed/>

<!-- Minimal optimization -->
<GSvg name="--logo" embed/>

<!-- Minimal optimization -->
<GSvg name="__figure" embed/>
```

If the optimization is still causing issues and you want the **original** svg markup embedding you can do the following

```handlebars
<GSvg name="menu" embed asis/>
```

### External

If the svg is a one off figure and/or doesn't need any styling applying or it's markup accessing then referencing an external file is the best way to go. Svg's can be dropped into `_Build/media` and referenced via image tags or css background images just like any other binary asset.

> Svg's can be dropped directly into the media folder as they contain actual code and can therefore be properly versioned by git, [see above](#core-assets-non-binary)

#### Html
```html
<img src="media/figure.svg" alt="figure">
```

#### Sass
```scss
.container{
    background-image: resolve("figure.svg");
}
```

## Icons

### Fontello

Icons are automatically pulled from [http://fontello.com/](http://fontello.com/) during the build process. The config that controls this can be found in `_Build/icons/config.json`. To add or remove icons do the following steps:

* Go to the fontello website
* Drag and drop the `config.json` file into the webpage. 
* This will highlight all the currently selected icons and allow you to select/deselect others. 
* Press the small arrow to the right on the "Download webfont" button and click "Get config only" 
* Replace the existing `config.json` with the downloaded one.

> `_Build/icons/config.json` isn't watched by the bundler so you will need to stop the watch and run `npm start` for the new files to be pulled down.

> The pulled icons are stored in the git ignored `_Build/icons/generated` and shouldn't be modified. 

### Custom

If a custom icon set has been created it can be used by dropping it into the `_Build/svg/'` folder. If the icon set already contains it's colors and final appearance then the svg files will need prefixing with a [double hyphen](#core-svg-optimization) `--`.

> If the icon is made up of strokes and [isn't* prefixed](#core-svg-optimization) then those strokes will need converting to paths by a designer

### Importing

Whether the icons are custom or have come from fontello they should end up in the global [spritesheet](#core-svg-optimization) and can be imported in one of the following ways.

> Make sure the Lab Ui ["icon.scss"](https://lab-ui.fishawack.solutions/#Icons) component has been imported

#### Html
```html
<div class="icon">
    <svg>
        <use xlink:href="#menu"></use>
    </svg>
</div>
```

#### Handlebars
```handlebars
{{> icon name="menu"}}

// Adding a class
{{> icon name="menu" class="icon--small"}}

// Will embed the svg markup directly in the page
{{> icon name="menu" class="icon--small" embed=true}}

// Will embed the original svg markup directly in the page
{{> icon name="menu" class="icon--small" embed=true asis=true}}
```

#### Vue
```handlebars
<GIcon name="menu"/>

// Adding a class
<GIcon name="menu" class="icon--small"/>
```

## Modernizr

To add a modernizr check into the build add the relevant property to the json object found in the [config files](#core-config). Modernizr will automatically apply the css rules to the root html element and the javascript `Modernizr` object will be avaiable globally on the window object.

#### Json
```json
{
    "attributes": {
        ...
        "modernizr": [
            "flexbox"
        ],
        ...
    }
}
```

#### Html
```html
<html class="flexbox / no-flexbox">
    ...
</html>
```

#### Sass
```scss
.class1{
    .flexbox &{
        display: flex;
    }

    .no-flexbox &{
        display: inline-block;
    }
}
```

#### Javascript
```js
if(window.Modernizr.flexbox){
    console.log("Supported");
}
```

## Testing

## Pdf

[Webdriver IO](http://v4.webdriver.io/v4.8/api.html) is used for the capture process. To enable the pdf generation you need to add a pdf property to the deploy target you'd like the pdf to be genereated on.

#### JSON
```json
"staging": {
    ...
    "pdf": true
}
```

This will capture just the `index.html` in the `chrome` browser at `1080x608` 16:9 aspect ratio.

To fine tune the pdf generation an object can be created called the capture object enabling more control over the pdf/pdf's that are generated. Here are the defaults.

#### JSON
```json
{
    "capture": {
        "browsers": [
            "chrome"
        ],
        "pages": [
            "/index.html"
        ],
        "sizes": [
            [1080, 608]
        ],
        "url": "http://localhost:9001",
        "wait": ".loaded"
    }
}
```

This will generate 3 sizes for 3 browsers (9 pdfs) capturing all the pages found in the pages array.

### Browsers

If the browsers specified here aren't on your machine and you try to generate a pdf then you'll recieve fatal errors. When pushed to gitlab to generate then gitlab will actually pass the pdf generation to capabile VM's so it's not an issues.

#### JSON
```json
"browsers": [
    "chrome",
    "firefox",
    "safari"
]
```

### Pages

Specify an array of pages that you wish to capture. Hashbangs without `.html` in front of them will go to the default `/index.html#/`. You can however pass in different html files if you have multiple vue entry points `/newPage.html#/about`.

#### JSON
```json
"pages": [
    "/index.html",
    "/login.html",
    "#/about",
    "#/terms",
    "#/privacy",
    "#/404",
    "/about",
    "/news"
]
```

### Sizes

Specify an array of sizes width x height.

#### JSON
```json
"sizes": [
    [1080, 608],
    [1366, 1024],
    [768, 1024]
]
```

> There will be a minimum size allowed which differs depending on the browser used. When using iphone dimensions 375x667 mobileEmulation mode will be passed to webdriver to allow smaller than usual browser width

### Url

The base url for the pdf'ing process. All pages are appended to this to create the full canonical url.

### Wait

How long / which selector to wait for before the page is considered loaded. By default the pdf process waits for `.loaded` class to exist somewhere on the page. You can override this to be a different selector or set it to a millisecond numeral value in which case the pdf process will wait for the specific amount of time.

### Client side

The pdf generation loads pages and takes screenshots as soon as the `.loaded` class appears on the root html element. This class **you** need to apply yourself when you're happy that the page has loaded what it needs to load to be considered finished and ready for capture.

> The `.loading` class isn't required for the pdf process but it's generally good practice to have it on the root to begin with and swap it out for `.loaded` when the page is ready. This allows loading indicators to spin on initial load.

#### Javascript
```javascript
(function(){
    ...

    document.querySelector('html').classList.remove('loading');
    document.querySelector('html').classList.add('loaded');
});
```

The pdf will now capture the `index.html` or the pages defined in `"pages"` in you the [config files](#core-config). In general this still isn't enough to correctly capture the page. If you have animations and transitions in your app that happen on page load then these will need deactivating during the pdf process so the pdf doesn't capture the start state of them. This is done automatically by the pdf process by adding a query parameter to the url `?capture=true`. Although the query parameter is automatically added **you** will still need add the javascript to the project to handle it.

> The pdf process automatically adds the `?capture=true` to the query string but there's nothing stopping you adding it in yourself during dev if you want instant page loads without waiting for the showbiz elements of the site to fire.

#### Javascript
```javascript
import * as Utility from "./libs/utility";

if (Utility.parse_query_string(window.location.search.substring(1)).capture === 'true') {
    document.querySelector('html').classList.add('capture');
    window.capture = true;
}
```

This sets a global javascript flag and a class on the root html element. Using these in the javascript/css you can turn off anything you don't want to run during capture process.

#### Javascript
```javascript
if(!window.capture){
    TweenMax.to(...);
}

setTimeout(() => {
    ...
}, (window.capture) ? 0 : 2000);
```

#### Sass
```scss
.hero{
    animation: 'fade' 0.2s;

    .capture &{
        animation: none;
    }
}
```

By adding in the following scss it'll disable *most* animations/transitions in your app, there may still be a few edge cases though.

#### Sass
```scss
.capture {
    *, *:after, *:before {
        transition: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
    }
}
```

This code can also be included from lab-ui directly

```scss
@import "@fishawack/lab-ui/_capture.scss";
```

### Custom capture

You can inject your own custom capture code into the built in capture scripts. First create the file `_Node/capture.js` which should export one or both of the functions you'd like to inject into. This can be useful in Vue projects for injecting dynamic routes onto the pages array rather than hard coding them in the [config files](#core-config).

#### Node
```javascript
module.exports = {
    // This is called right after the viewport has been resized before the pages are iterated over
    size: function(capture){
        var dynamicPages = require(...);
        // Add dynamic demo pages to pages captured array
        dynamicPages.forEach((d) => {
            capture.page.array.push(d);
        });
    },
    // This is called after the standard page capture has happened on each page
    page: function(capture){
        // Capture nav on homepage only
        if(capture.page.index === 0){
            it('Nav', function() {
                browser.click('.js-menu');

                // Passing true to the screenshot function captures just the visible viewport, ommitting true will cause the page to scroll and capture everything
                capture.screenshot.call(true);
            });
        }
    }
};
```

## Deploying

The majority of our deployments are "push" deployments where the website is fully built through CI/CD and then simply transferred to the server via a choice of different transfer protocols. Obviously if a site or client requires/prefers a git "pull" deployment approach then this is completely fine but would need to be configured on a per project basis. 

### Servers

We have quite a few servers that we use for both staging and production deployments, but we should be aiming to keep all of our sites on our two main server providers depending on the primary website target the site is aimed at. The server providers are TsoHost for EU sites and Liquid web for US.

#### EU - Tsohost

For Tsohost we have two primary servers, Gandalf and Galadriel. Gandalf is fairly full at this point so we've purchased a second server that should be used for all new builds.

#### US - Liquidweb

For liquid web we currently have just a single server that is used for shared deployments and that is the Balrog server.

#### Global - AWS

All static builds as of 2022/09/10 should now be pushed to AWS via `fw provision` commands.

### Configs

Here are two simple configs that can be used to deploy to either the US or EU deployment locations.

```json
{
    "attributes": {
		"targets": {
            "staging-eu": {
                "deploy": {
                    "url": "https://staging.fishawack.solutions/bespoke/",
                    "location": "/home/fishawack/staging.fishawack.solutions/bespoke/",
                    "lftp": "vidaHost-fishawack",
                    "subDir": "<%= repo.name %>"
                }
            },
            "staging-us": {
                "deploy": {
                    "url": "https://staging.us.fishawack.solutions/bespoke/",
                    "location": "/home/fishawack_us/staging.us.fishawack.solutions/bespoke/",
                    "lftp": "balrog-fishawack",
                    "subDir": "<%= repo.name %>"
                }
            }
        }
    }
}
```

### Watertight

Watertight is a simple php wrapper that can be enabled on any frontend projects to wrap them in a fairly simple authentication layer.

To enable watertight you need to add the property `loginType` to a deploy target that will trigger a regular deploy to wrap the watertight files around the build. The `loginType` property takes a few various style options but many of those are now deprecated so you should stick to setting this value to `bootstrap` for most/all projects.

```json
"deploy": {
    "url": "https://staging.fishawack.solutions/bespoke/",
    "location": "/home/fishawack/staging.fishawack.solutions/bespoke/",
    "lftp": "vidaHost-fishawack",
    "subDir": "<%= repo.name %>",
    "loginType": "bootstrap",
    "users": [
        {
            "username": "digital@fishawack.com",
            "group": "admin",
            "validTo": "",
            "password": "<password here>"
        }
    ]
}
```

#### Styling

By default the login is styled with a basic bootstrap styling. If you wish to create a custom login page you need to create a `login-form.hbs` inside your handlebars snippets. This file should contain the following php by default, you can then add you classes and/or custom elements around these.

> Strangely there is a bug where the very first line of the login-form.hbs file needs to be an empty line.

#### Handlebars
```handlebars

{{{{raw}}}}{{ errors }}{{{{/raw}}}}

<form name="login" method="post" action="<?php echo $formPostUrl;?>">

    <input type="hidden" name="returnUrl">
    <input type="hidden" name="qs">

    <label for="username">Username</label>

    <input 
        type="text"
        name="username"
        placeholder="Username"
        autofocus="autofocus"
        maxlength="200"
        required="required"
        id="userName"
    >

    <label for="password">Password</label>

    <input
        type="password"
        name="password"
        placeholder="Password"
        maxlength="100"
        required="required"
        id="password"
    >

    <button type="submit">Log-in</button>

</form>

<script>
    window.onload = function() {
        var hash = window.location.hash.slice(1);
        var f = document.forms["login"];
        var returnUrl = f.elements["returnUrl"].value;
        if (hash) f.elements["returnUrl"].value = returnUrl + "#" + hash;
    }
</script>
```

You also need to create a html file that simply imports this, this is primarily for uncss to know what not to strip but without this the form will default to the bootstrap. This is usally placed in `_Build/html/login-form.html`.

#### Handlebars
```handlebars
{{> login-form}}
```

### Cache busting

Production builds will automatically cache bust css and javascript files by appending a random hash and the prefix 'cache' in the assets filename. Any html files and the assets filename itself will both automatically be re-written to point to the new filename.

```html
<html>
    <head>
        <!-- Before -->
        <script src="/script.js"></script>
        <link rel="stylesheet" href="general.css"/>

        <!-- After -->
        <script src="/script.cache.06bfbf5d35a264f2.js"></script>
        <link rel="stylesheet" href="general.cache.06bfbf5d35a264f2.css"/>
    </head>
</html>
```

```bash
# Before
_Output/js/script.js
_Output/css/general.css

# After
_Output/js/script.cache.06bfbf5d35a264f2.js
_Output/css/general.cache.06bfbf5d35a264f2.css
```

#### Disabling

If cache busting is causing issues, the easiest way to disable it is to override the default config by creating a file in the following location `_Tasks/options/cacheBust.js`.

```javascript
module.exports = {
    options: {
        assets: [
        ]
    },
    default: {
        src: []
    }
}
```

### Prerendering

Most commonly found in SPA projects, prerendering is the process of rendering out the html pages as a build step so that when the page loads for the first time in the clients browser, the SPA framework can latch on to preexisting html markup rather than completely rendering out the entire page from scratch. Other benefits prerendering can give you are: 

* The site will have something to display with javascript disabled
* Search engines will be able to parse and collect information about the website easier
* Time until first load will be faster as the page will be visible before the javascript has to load
* History mode can work without any .htaccess rewriting or hash bang mode needed

There are however instances where prerendering won't work well.

* Lots of dynamic user curated views.
* Sites that need are directly connected to a CMS or API and need live dynamic content
* Sites with 1000's of views

If you're site doesn't tick any of those boxes and you're using an SPA framework then to enable prerendering all you need to do is set the flag in the config.

```json
"attributes": {
    "prerender": true
}
```

This will by default only prerender the view found at '/'. To prerender more view's you'll need to create a javascript file at the location `_Node/prerender.js`. This file needs to export a function that returns an array the defines which views need to be prerendered. The logic for how this works is down to the developer, whether you want to pull from a CMS to define some dynamic routes, or just hardcode the array its down to whatever implementation the website needs.

```javascript
// Hard coded array example
module.exports = () => ['/', '/about', '/contact'];

// Pulling a local json file to determine the views
module.exports = () => require('routes.json').map(route => route.path);
```

Lastly you'll need to ensure the app id is on the root vue component as well as the root html component that vue uses to mount. This is because after the prerendering has happened the root html element no longer exists, but to successfully hydrate your prerendered views with the dynamic vue pages it still needs to latch onto the same id. In the boilerplate repositories this is done like so.

```handlebars
<!-- _Build/html/index.html -->
{{#> base}}
	<div
        id="app"
        data-version="{{version}}"
        data-title="{{attributes.title}}"
    ></div>
{{/base}}

<!-- _Build/vue/app/app.vue -->
<template>
	<main id="app">
    </main>
</template>
```

#### Client-side flag

Often times when prerendering they'll be certain scenarios where you don't want something to run during the prerender step. An example of this is a GTM tag or a OneTrust code snippet that onload will do a bunch of changes to your page markup. If you run this code during the prerender step and then the code runs again when the page itself loads then you're going to hit a bunch of client side issues that may be difficult to debug.

To combat this there is a client side global flag that you can use to prevent certain actions from happening during the prerender step.

```javascript
// During prerender
window.prerender === {
    engine: 'puppeteer'
};

// Regular page load
window.prerender === undefined;
```

Using this script you can rewrite your include snippets to append to the head only during regular loads of the page and not during prerenders.

```html
<!-- Regular OneTrust snippet -->
<script src="https://cdn.cookielaw.org/consent/{{@root.env.ONE_TRUST}}/OtAutoBlock.js" ></script>
<script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"  data-domain-script="{{@root.env.ONE_TRUST}}" ></script>
<script> function OptanonWrapper() { } </script>

<!-- Rewritten dynamic OneTrust snippet -->
<script>
    if (!window.prerender) {
        var script = document.createElement("script");
        script.type = "application/javascript";
        script.src = 'https://cdn.cookielaw.org/consent/{{@root.env.ONE_TRUST}}/OtAutoBlock.js';
        document.head.appendChild(script);

        script = document.createElement("script");
        script.type = "application/javascript";
        script.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
        script.setAttribute('data-domain-script', '{{@root.env.ONE_TRUST}}');
        document.head.appendChild(script);

        function OptanonWrapper() { }
    }
</script>
```

## Packaging

### Electron

Electron builds are typically used to circumvent the need for a site to be loaded locally via a web server. A common use case for this is booth events where the site might be running on a large touch screen and the IT technicians who are overseeing the build may not have sufficient knowledge of installing and running web servers in local environments.

Obviously there's a lot more you can do with Electron builds like running multiple screens in parallel and having them communicate locally over sockets for example.

The simplest way of enabling the electron wrapper is to simply set the electron property to true against a target branch or globally.

```json
"attributes": {
    "electron": true
}
```

The build will produce both a Windows and a Mac Electron wrapper and attach them to the build emails for download.

### Cordova

#### iOS

You'll need to make sure you have a copy of the latest signed certificate! You'll then need to login to the Apple iOS developers portal to create a provisioning profile:

[Apple Developer Portal](developer.apple.com)

<< TODO: packaging options >>

## Extending

The core is essentially a wrapper around [gruntjs](https://gruntjs.com/) task runner that abstracts a lot of the code that would be simply repeated throughout project codebases. These grunt tasks vary from webpack javascript transpiling to prerendering scripts and generating pdfs.

Extending/Overridding can be done at two levels: 

* Options: This is where configuration options are specificed for a task
* Task registration: These files actually register the [tasks](https://gruntjs.com/api/grunt.task) which then consume the options found above

### Options

To override the options you simply create a file of the [same name](https://github.com/fishawack/core/tree/master/_Tasks/options) as the options you'd like to override and place it in the location `_Tasks/options/` at the root of the project.

```js
// _Tasks/options/sass.js
module.exports = {
	options: {
		outputStyle: 'expanded',
		sourceMap: true
	},
    default: {
        files: {
            src: 'myCustomSass.sass',
            dest: 'myCustomSass.css'
        }
    }
}
```

If you simply want to extend the existing options you can pull in the existing options using the globally available variable `configPath` which points to the inner node_module options and then simply merge your new options.

```js
var obj = require(`${process.cwd()}/${configPath}_Tasks/options/sass`);

obj.default.files.src = 'myCustomSass.sass';

module.exports = obj;
```

### Task registration

The tasks found in the core are custom tasks that provide or extend some base task functionality. Most tasks that run during the bundle process are completely out of the box npm modules and don't require a task file inside the @fishawack/core itself and simply consume the options that are passed in.

If you do still need to override a task then you will generally requires gruntjs knowledge of how [multitasks and regular tasks](https://gruntjs.com/api/grunt.task) work.

To override the tasks you simply create a file of the [same name](https://github.com/fishawack/core/tree/master/_Tasks) as the task you'd like to override and place it in the location `_Tasks/` at the root of the project.

```js
// _Tasks/compress.js
module.exports = grunt => {
    grunt.registerMultiTask('compress', function() {
        // Code written here will run when compress task is called
    });
};
```

The most common need to adjust a task is to change the `default`, and the `dist` tasks which are themselves simply wrappers that run a set of pre-defined tasks. 

If for example you wanted the [default](https://github.com/fishawack/core/blob/master/_Tasks/default.js) `grunt` command to also run a custom task called `foo` you could add that into the default flow like so:

```js
// _Tasks/default.js
module.exports = grunt => {
    grunt.registerTask('default', ['foo', 'browserSync', 'watch']);
};
```

## Troubleshooting

### Docker compose v2

Some developers are reporting the docker option of "Use Docker Compose V2" is being enabled on their machines without them knowing. This flag currently isn't compatible with lab-env and throws the following error:

```bash
Warning: No resource found to remove                                                                                                        0.0s
Command failed: docker-compose --env-file /Users/ctiley/Sites/fide.net/.env -f /Users/ctiley/.nvm/versions/node/v10.19.0/lib/node_modules/@fishawack/lab-env/laravel/8/docker-compose.yml -f /Users/ctiley/.nvm/versions/node/v10.19.0/lib/node_modules/@fishawack/lab-env/core/docker-compose.yml -p 
```

### npm ci failure

#### Problem

Sometimes when running `npm install` on a project that already has its package-lock file generated will cause the git dependiences to [switch their protocols](https://github.com/npm/cli/issues/2610) to ssh:// rather than https://. When the build tries to install through gitlab you'll run into errors like below:

```bash
> npm ci && npm run content
npm WARN prepare removing existing node_modules/ before installation
npm ERR! Error while executing:
npm ERR! /usr/bin/git ls-remote -h -t ssh://git@github.com/mikemellor11/grunt-scorm-manifest.git
npm ERR! 
npm ERR! Warning: Permanently added 'github.com,140.82.121.3' (RSA) to the list of known hosts.
npm ERR! git@github.com: Permission denied (publickey).
npm ERR! fatal: Could not read from remote repository.
npm ERR! 
npm ERR! Please make sure you have the correct access rights
npm ERR! and the repository exists.
npm ERR! 
npm ERR! exited with error code: 128
npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2021-08-20T08_35_40_457Z-debug.log
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! @fishawack/stream@11.4.6 setup: `npm ci && npm run content`
npm ERR! Exit status 1
```

#### Solution

The real solution will come from npm when they patch the issue. For now though the fastest way around this is to simply regenerate the package-lock file locally and re-push.

```bash
lab-env regen
```

### Uglify failure

#### Problem

Babel and Webpack purposefully do not process node_module javacript files to keep things quick. This can cause problems if the library owner didn't provide an es5 friendly implementation of their code. When this happens you will often see the below error on production builds.

```bash
Running "uglify:dist" (uglify) task
JS_Parse_Error {
  message: 'SyntaxError: Unexpected token: name (n)',
  filename: '../../.tmp/js/script.js',
  line: 1,
  col: 1019,
  pos: 1019,
  stack:
   'Error\n  at new JS_Parse_Error (<anonymous>:1547:18)\n  at js_error (<anonymous>:1555:11)\n  at croak (<anonymous>:2094:9)\n  at token_error (<anonymous>:2102:9)\n  at unexpected (<anonymous>:2108:9)\n  at semicolon (<anonymous>:2128:56)\n  at simple_statement (<anonymous>:2319:73)\n  at eval (<anonymous>:2188:19)\n  at eval (<anonymous>:2141:24)\n  at ...' }
>> Uglifying source .tmp/js/script.js failed.
Warning: Uglification failed.
SyntaxError: Unexpected token: name (n). 
Line 1 in .tmp/js/script.js
 Use --force to continue.
```

#### Solution

Check the library source files for a .cjs extension of the main module, this is usually the es5 friendly version.

As of [core version 7.4.0](#core-changelog-740) you can now specify a list of node_modules you would like to go through the regular transpiling step.

```json
"attributes": {
    "transpile": [
        "@fishawack/lab-d3"
    ]
}
```

Unfortunately if you can't easily pinpoint a dependency that was recently installed that could be causing this problem the fix is to `fw connect` into your docker container and manually run the following command.

```bash
$grunt concat:dist webpack:dist uglify:dist
```

This should then give you the same failure locally allowing you to start mass removing libraries in an attempt to track down which import/require is actually causing the problem. Make sure you're fully git committed before you start removing code!


### Postcss static img

```bash
Fatal error: Cannot read property 'fetch' of null
```

#### Problem

Postcss has a bug where including an img tag anywhere inside a nested template tag will throw an error if the src is static.

```handlebars
<template>
    <div>
        <template>
            <img src="images/test.png"/>
        </template>
    </div>
</template>
```

#### Solution

Just make the src a dynamic property and bind the static src.

```handlebars
<template>
    <div>
        <template>
            <img :src="'images/test.png'"/>
        </template>
    </div>
</template>
```

### Customizer 404

```bash
npm ERR! code E404
npm ERR! 404 Not Found - GET https://codeload.github.com/Modernizr/customizr/legacy.tar.gz/develop
```

#### Problem

This issue stems from a bad decision on the Customizr open source library to point a dev dependency directly to a file stored on a branch of a repo.

[We did try](https://github.com/Modernizr/grunt-modernizr/issues/146) to convince the author to fix the issue on their side, and in fact they did fix it for a while, but ultimately the problem surfaced again a few months later.

#### Solution

We put a permanant fix inplace for this as of [core version 4.5.3](#core-changelog-453). Bump to at least this version and regenerate the `package-lock.json` file.

### Svg asset path

```bash
ERROR in ./_Build/vue/globals/GSvg/GSvg.vue?vue&type=template&id=c839c296&functional=true& (./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./_Build/vue/globals/GSvg/GSvg.vue?vue&type=template&id=c839c296&functional=true&)
Module not found: Error: Can't resolve '../../../handlebars/partials/generated/embed' in '/app/_Build/vue/globals/GSvg'
 @ ./_Build/vue/globals/GSvg/GSvg.vue?vue&type=template&id=c839c296&functional=true& (./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./_Build/vue/globals/GSvg/GSvg.vue?vue&type=template&id=c839c296&functional=true&) 8:12-12:21
 @ ./_Build/vue/globals/GSvg/GSvg.vue?vue&type=template&id=c839c296&functional=true&
 @ ./_Build/vue/globals/GSvg/GSvg.vue
 @ ./_Build/js/script.js
```

#### Problem

Svg asset path is now set to the wrong location after [migrating core versions](#core-migrating-600).

#### Solution

[Update svg path](#core-migrating-600).

### BrowserSync not reloading

For some reason (and i've literally no idea why) if you install a local version of mocha on a project it will stop the browserSync from live reloading when saving local project files.

#### Solution

Mocha is already included as a `@fishawack/core` dev dependency so it shouldn't be needed as a project dependency as well. If this is the case then simply remove the dependency from the package.json file and regenerated the node_modules.

### Yargs stopping commands

```bash
>> Error: yargs parser supports a minimum Node.js version of 12. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions
```

#### Problem

Yargs had a minor version publish which contained a breaking change that meant people running node versions before node 12 would now throw errors.

#### Solution

Bump to `core@7.14.2` or install `yargs@16.2.0` on the project itself. If you hit the issue of maximum call stack exceeded then manually add the dependency to the package.json and run `fw regen`

## Common commands

The commands in this section are written out relative to the core library. In practice you will likely be running commands through lab-env in which case you need to prefix each command like so:

```bash
$grunt capture pdf

# Would become

lab-env exec -d "$grunt capture pdf"
```

> The -d flag here specifies a virtual frame buffer which is needed when trying to generate screenshots, it may not be needed for some commands but it doesn't hurt to always specify it just incase.

### Generating a pdf

The pdf command is two parts, the task that creates the screenshots and the task that generates a pdf file. The capture task will generate screenshots and place them in the .tmp folder and the pdf task will take those screenshots and stitch them together into an optimized pdf file.

```bash
$grunt capture pdf
```

Before core@5.7.0 the pdf command was a single command that captured screenshots and then generated pdf files.

```bash
$grunt pdf
```

### Generating a veeva package

This command *DOES NOT* run a production build of your files, if you need a production build then run that before running the veeva package commands. The veeva package step requires screenshots to be generated for use as thumbnails - this was the main reason for splitting the capture/pdf step mentionede previously.

```bash
$grunt capture package:veeva
```

Before core@5.7.0 the screenshots had to be generated as part of the pdf process which took a little longer

```bash
$grunt pdf package:veeva
```

### Local deployments

Since [core version 7.5.0](#core-changelog-750) the deploy command no longer runs the full deployment process, instead all commands are now split into single purpose tasks. To simulate the old `npm run deploy` command you'll now need to run all commands in sequence.

```bash
# Npm commands
npm run content && npm run production && npm run package && npm run deploy && npm run mail

# @fishawack/lab-env commands
fw content && fw prod && fw run -d package && fw deploy && fw run mail
```

## Migrating

### 8.0.0

#### Docker images

Because core@8 now uses a different image to all the versions before it, you can't bump the version in the traditional way as it'll try to update its core version using the old node@10 which will throw errors.

To get around this you'll need to manually bump the version, remove the package-lock.json file and run a regular npm install.

```json
{
    "devDependencies": {
        "@fishawack/core": "^8.1.2"
    }
}
```

Then run the following commands

> The commands below are shown in their raw npm form. When using lab-env ensure to install with `fw install` to ensure npm & node versions match across developer machines

```bash
rm package-lock.json

npm install
```

#### gitlab-ci.yml

Ensure to bump the `gitlab-ci.yml` to a minimum of `4.0.0`.

```yml
include:
  - project: 'configs/gitlab-ci'
    ref: v4.0.0
    file: '.gitlab-ci.yml'
```

#### Vue@2 compiler & loader

Due to our switch to webpack 5 and preparing the core for the update to Vue@3 in the future we've had to bump our vue-loader resulting in a slightly different sytnax needed to continue supporting Vue@2. Along with this we no longer install vue-template compiler into the core dependencies as this dependency was always locked to the vue version anyway so often got overridden when the vue version was changed.

To get vue loader and vue template compiler working with Vue@2 again install the following packages:

> The commands below are shown in their raw npm form. When using lab-env ensure to install with `fw install vue-loader@15 --save-dev` to ensure npm & node versions match across developer machines

```bash
npm install vue-loader@15 --save-dev

# check vue version in project and ensure it matches the package installed below
npm install vue-template-compiler@2.5.17 --save-dev --save-exact
```

> After moving to Vue@3 the above dependencies will need removing or it'll cause build issues

#### Capture scripts
* Capture scripts needs to use webdriverio v8 [api methods](https://webdriver.io/docs/api/browser) which will likely break any custom capture code. 

The main difference here is the switch from synchronous code to asynchronous which requires refactoring code to use async awaits as webdriverio will no longer stop execution on internal calls i.e.

```javascript
// Old way
it('Capture contact page', () => {
    browser.url(`${capture.url}/contact`);

    capture.page.wait();

    capture.screenshot.call();

    browser.isExisting(selector);

    browser.waitForExist(selector, 10000);
});

// New way
it('Capture contact page', async () => {
    await browser.url(`${capture.url}/contact`);

    await capture.page.wait();

    await capture.screenshot.call();

    await $(selector).isExisting();

    $(selector).waitForExist(10000);
});
```

Chrome browser has also been swapped out for chromium which should have relative little impact but there do exist some slight [differences](https://www.lambdatest.com/blog/difference-between-chrome-and-chromium/).

#### Testing updates

Ensure the two testing folders within _Test are now named ui and unit or the test runners will no longer find the test suites.

```bash
_Test/karma -> _Test/unit
_Test/casperjs -> _Test/ui
```

Unit test now need their full path specifying when importing into test suites.

```javascript
// _Test/unit/utility.js
// Old way
var Utility = require('utility');

// New way
var Utility = require('../../_Build/js/libs/utility.js');
```

Ui tests are also driven by webdriverio and will need to update syntax to match the v8 [api methods](https://webdriver.io/docs/api/browser) and refactored to be asynchronous.

Another change is that the base url and any capabilities are now defined in the `browser.requestedCapabilities` property meaning the fishawack specific imports can and should be removed.

```javascript
// Old way
require('@fishawack/core/_Tasks/helpers/include.js')(require('grunt'), true);
const expect = require('chai').expect;

var http = require('http');

describe('index', () => {
    it('200 status code', () => {
        let status;

        browser.call(() => {
            return new Promise((resolve) => {
                http.get(`${captureEnv().url}/index.html`, res => {
                    status = res.statusCode;
                    resolve();
                });
            });
        });

        expect(status).to.be.equal(200);
    });
});

// New way
const expect = require('chai').expect;
const http = require('http');

describe('index', () => {
    it('200 status code', async () => {
        let res = await new Promise(resolve => http.get(`${browser.requestedCapabilities.url}/index.html`, resolve));
        
        expect(res.statusCode).to.be.equal(200);
    });
});
```

#### Shipped browsers

Firefox is no longer installed within the base lab-env core image but can still be specified and used if firefox manually installed.

```json
// Old way
{
    "capture": {
        "browsers": [
            "chrome",
            "firefox",
            "safari"
        ]
    }
}
// New way
{
    "capture": {
        "browsers": [
            "chrome"
        ]
    }
}
```

#### Environment variables

Previous versions of the core would recieve all environment variables sourced into the bash process automatically meaning CI variables were availabile within the docker containers. This is no longer the case which could impact some custom deploy scripts.

To source the variables again you have to manually load the file in like so:

```bash
# If the env.sh exists then source it
if [ -f ./env.sh ]; then
    . ./env.sh;
fi

# Custom deploy scripts here
```

#### Credential updates

> The following migration steps only apply to projects that are actively reading credential files found in the root of the project which should be fairly uncommon.

.ftppass is no longer used in anyway in the @fishawack/core repository

Credential files are also no longer copied into the root of the project and instead are read into memory and stored in the active process.

If any project is actively reading these credential files it'll need updating to read them from the users home directory i.e.

```javascript
const fs = require('fs');
const os = require('os');
const creds = JSON.parse(fs.readFileSync(`${os.homedir()}/targets/ftp-fishawack.egnyte.com.json`));
```

#### Task updates

> The following migration steps only need applying to repositories that override/overwrite the base @fishawack/core tasks via a _Tasks folder and corresponding task file i.e stream.

* [Svgo](https://github.com/svg/svgo) has been updated two major versions thus the syntax has changed and the migration steps will need following
    * https://github.com/svg/svgo/releases/tag/v2.0.0
    * https://github.com/svg/svgo/releases/tag/v3.0.0

* We've also switched from [tv4](https://github.com/geraintluff/tv4) to [ajv](https://github.com/ajv-validator/ajv) json schema as tv4 is no longer maintained. During the switch we've also switched to json schema 7.

#### Task sunsets

> The following migration steps only need applying to repositories that override/overwrite the base @fishawack/core tasks via a _Tasks folder and corresponding task file i.e stream.

* jshint no longer runs (will soon be replaced by eslint)
* jsonlint no longer runs (json-schema handles syntax errors)
* imagemin no longer runs (this is now the responsiblity of design just like video compression is part of motions job)

#### Feature sunsets

* ftp deployments no longer supported so if any project is still using ftp for content pulls or deployments then they'll need switching to a newer protocol.

### 7.5.0

Although not a breaking change when running things through CI/CD, `core@7.5.0` did introduce a breaking change when running certain commands locally due to some npm scripts being split into smaller more focused tasks. This means the package.json scripts will need updating to the following.

> Before replacing the scripts below ensure there are no custom commands that have been added to your npm scripts. If there are make sure to incorporate them in the new script layout

```json
// Old way
{
    "scripts": {
        "start": "npm start --prefix node_modules/@fishawack/core/",
        "setup": "npm ci || npm i && npm run content",
        "deploy": "npm run deploy --prefix node_modules/@fishawack/core/",
        "deploy-s": "npm run deploy-s --prefix node_modules/@fishawack/core/",
        "production": "npm run production --prefix node_modules/@fishawack/core/",
        "content": "npm run content --prefix node_modules/@fishawack/core/",
        "test": "npm test --prefix node_modules/@fishawack/core/"
    }
}

// New way
{
    "scripts": {
        "setup": "npm ci || npm i && npm run content",
        "content": "npm run content --prefix node_modules/@fishawack/core/",
        "start": "npm start --prefix node_modules/@fishawack/core/",
        "production": "npm run production --prefix node_modules/@fishawack/core/",
        "test": "npm test --prefix node_modules/@fishawack/core/",
        "package": "npm run package --prefix node_modules/@fishawack/core/",
        "deploy": "npm run deploy --prefix node_modules/@fishawack/core/",
        "mail": "npm run mail --prefix node_modules/@fishawack/core/"
    },
}
```

#### gitlab-ci.yml

Ensure to bump the `gitlab-ci.yml` to a minimum of `2.0.0`.

```yml
include:
  - project: 'configs/gitlab-ci'
    ref: v2.0.0
    file: '.gitlab-ci.yml'
```

### 7.0.0

We switched from uncss to purgecss so any ignore tags will need switching to the following.

```scss
// Old way
/* uncss:ignore start */
.class1{
    ...
}
/* uncss:ignore end */

// New way
/* purgecss start ignore */
.class1{
    ...
}
/* purgecss end ignore */
```


### 6.0.0

Sass now manages its own watch. This generally doesn't effect stand alone repos, but will effect frameworks and projects that override the sass task. These frameworks will need to map their sass files to a single sass process so that the watch can handle reloading the files.

The uncss property in the config is no longer needed and will throw an error when the json schema runs. Simply remove the following lines from the config:

```json
{
    "uncss": [
        "<%= root %>/*.html",
        ".tmp/vue/**/*.vue"
    ]
}
```

#### Svg embed path

Svg files no longer build to `_Build/handlebars/partials/generated` instead building to `_Build/handlebars/generated`. This can impact Vue projects where GSvg tries to resolve paths to the aforementioned location. To fix simply update the paths as follows:

```html
// Old way
<div
    v-html="require(`../../../handlebars/partials/generated/embed/svg${props.asis ? '--asis' : ''}--${props.name}.svg`)"
    :class="[data.class,data.staticClass]"
    v-if="props.embed"
/>

// New way
<div
    v-html="require(`../../../handlebars/generated/embed/svg${props.asis ? '--asis' : ''}--${props.name}.svg`)"
    :class="[data.class,data.staticClass]"
    v-if="props.embed"
/>
```

#### Cache folder

There's a new .cache folder where temporary build files are placed. This simply needs adding to the .gitignore file

```bash
.cache
```

#### SvgSprite moved

SvgSprite.svg now builds to `_Build/handlebars/partials`. Because of this you'll have to remove the previous locations file or that'll take precedence over the new file during build. Remove the following folder.

```bash
_Build/handlebars/partials/generated
```

### 5.0.0

Up until now, master branch always deployed the production target, qc branch deployed qc target and development  deployed staging. Now deploy targets are mapped directly to branch names, so a staging branch will need to be created to deploy the old staging deploy target. The config will also need updating to the following format.

```json
// Old way
{
    "attributes": {
        "staging": {
            "url": "...",
            "location": "..."
        }
    }
}

// New way
{
    "attributes": {
        "targets": {
            "staging": {
                "deploy": {
                    "url": "...",
                    "location": "..."
                }
            }
        }
    }
}
```

#### gitlab-ci.yml

Ensure to bump the `gitlab-ci.yml` to a minimum of `1.0.5`.

```yml
include:
  - project: 'configs/gitlab-ci'
    ref: v1.0.5
    file: '.gitlab-ci.yml'
```
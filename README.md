## Background

### What

This repo contains the code that fetches assets, bundles code and deploys it to the server.

### Why

As a company we do a lot of smaller short term builds rather than longer term code bases. To keep code bases small we create many smaller repo's rather than branching projects in a larger monorepo. For this reason we ended up with lots of duplicate task runner code in each repo that had to be manually updated if any projects came back from the dead further down the line. Around 2014 all of that code was pulled to a shared npm module which meant a massive reduction in code repetition throughout all of our code bases.

## Dependancies

As this code base is shared amongst most of our repos, these dependancies are likely the only ones you'll ever need to install to get project code up and running. They've been split into two groups, build and deploy dependancies.

### Build

The following dependancies are needed to pull assets from the server and build the source code.

* node (11.15.0 recommended)
* npm (5.7.1 or above)
* node-gyp
* grunt-cli
* git
* wget
* imagemagick
* jq
* ftp (mac high sierra and above)
* xCode
* xCode command line tools

### Deploy

These dependancies are only needed if you're planning to build a pdf locally or manually deploy to the server.

* ghostscript
* wine
* xquartz
* java8
* python (windows only)
* composer

## Getting started

### Mac

* Install brew - [http://brew.sh/](http://brew.sh/) - then run the following commands

```bash
brew install git
brew install wget
brew install imagemagick
brew install ghostscript
brew install wine
brew install jq
brew install lftp
brew install tnftp tnftpd telnet telnetd
brew install cask
brew cask install java8
brew cask install xquartz
```

* Install Nvm - [https://github.com/creationix/nvm](https://github.com/creationix/nvm) - then run the following commands

```bash
nvm install 11.15.0

npm install grunt-cli -g
npm install node-gyp -g
```

* Install xCode via mac app store - then run the following command

```bash
xcode-select --install
```

* Install composer [https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx)

### Windows

* Install choco - [https://chocolatey.org/](https://chocolatey.org/) then use to install the following

```bash
choco install git
choco install wget
choco install imagemagick
choco install ghostscript
choco install wine
choco install jq
choco install lftp
choco install java8
choco install xquartz
```

* Install Nvm - [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

```bash
nvm install 10.0.0
npm install grunt-cli -g
```

* Install composer [https://getcomposer.org/doc/00-intro.md#installation-windows](https://getcomposer.org/doc/00-intro.md#installation-windows)

## Commands

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

If on the **development** branch this command will deploy to **staging**.

If on the **master** branch this command will deploy to **production**.

If on any other branch this command **won't** deploy anywhere but will still prepare the bundle in production mode.

## Credentials

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

The json that dictates which asset folders are pulled can be found in the `_Build/content.json`.

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

process.env.NODE_TARGET === "production" // when on master branch
process.env.NODE_TARGET === "qc" // when on qc branch
process.env.NODE_TARGET === "staging" // when on any other branch
```

#### Custom

Custom enviroment varibles can be defined globally in the `content.json`.

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

### Prefixing

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

### Uncss

Classes that aren't present in any html files **before** javascript runs are considered redundant and are removed from the final bundled css file.

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

#### Vue

All `.vue` files found in `_Build/vue/` will be converted to html and then ran through the same process as above to check for unused css. This won't execute javascript and will ignore any tags that aren't native html tags so its fairly common to have to use more uncss ignore tags in a vue/SPA project.

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

Same as the double hyphen but these svg's **aren't** added to the global [sprite sheet](#config-grunt-svg-sprite-sheet)

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
<svg><use xlink:href="#menu"></use></svg>

<!-- Minimal optimization -->
<svg><use xlink:href="#--logo"></use></svg>

<!-- Error - not included in the sprite sheet -->
<svg><use xlink:href="#__figure"></use></svg>
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

If you need to use an embedded svg in a dynamic templating language like vue then you'll need to grab the actual markup and insert it directly into your vue/html markup. The optimized files can be found in `_Build/handlebars/partials/generated/embed`.

### External

If the svg is a one off figure and/or doesn't need any styling applying or it's markup accessing then referencing an external file is the best way to go. Svg's can be dropped into `_Build/media` and referenced via image tags or css background images just like any other binary asset.

> Svg's can be dropped directly into the media folder as they contain actual code and can therefore be properly versioned by git, [see above](#config-grunt-assets-non-binary)

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

If a custom icon set has been created it can be used by dropping it into the `_Build/svg/'` folder. If the icon set already contains it's colors and final appearance then the svg files will need prefixing with a [double hyphen](#config-grunt-svg-optimization) `--`.

> If the icon is made up of strokes and [isn't* prefixed](#config-grunt-svg-optimization) then those strokes will need converting to paths by a designer

### Importing

Whether the icons are custom or have come from fontello they should end up in the global [spritesheet](#config-grunt-svg-optimization) and can be imported in one of the following ways.

> Make sure the Lab Ui ["icon.scss"](https://demo.fishawack.solutions/Lab/Ui/#Icons) component has been imported

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

To add a modernizr check into the build add the relevant property to the json object found in `_Build/content.json`. Modernizr will automatically apply the css rules to the root html element and the javascript `Modernizr` object will be avaiable globally on the window object.

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

To fine tune the pdf generation an object can be passed into the pdf property enabling more control over the pdf/pdf's that are generated.

#### JSON
```json
{
    "staging": {
        ...
        "pdf": {
            "browsers": [
                "chrome",
                "firefox",
                "safari"
            ],
            "pages": [
                "index.html",
                "login.html",
                "#/about",
                "#/terms",
                "#/privacy",
                "#/404"
            ],
            "sizes": [
                [1080, 608],
                [1366, 1024],
                [768, 1024]
            ]
        }
    }
}
```

This will generate 3 sizes for 3 browsers (9 pdfs) capturing all the pages found in the pages array.

> Hashbangs without `.html` in front of them will go to the default `index.html#/`. You can however pass in different html files if you have multiple vue entry points `newPage.html#/about`.

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

The pdf will now capture the `index.html` or the pages defined in `"pages"` in you `content.json` file. In general this still isn't enough to correctly capture the page. If you have animations and transitions in your app that happen on page load then these will need deactivating during the pdf process so the pdf doesn't capture the start state of them. This is done automatically by the pdf process by adding a query parameter to the url `?capture=true`. Although the query parameter is automatically added **you** will still need add the javascript to the project to handle it.

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

### Custom capture

You can inject your own custom capture code into the built in capture scripts. First create the file `_Node/capture.js` which should export one or both of the functions you'd like to inject into. This can be useful in Vue projects for injecting dynamic routes onto the pages array rather than hard coding them in the `content.json`.

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

### Servers

### iOS packaging with PhoneGap

You'll need to make sure you have a copy of the latest signed certificate! You'll then need to login to the Apple iOS developers portal to create a provisioning profile:

[Apple Developer Portal](developer.apple.com)

#### Create App ID

1. Go to Identifiers > App IDs, click "+" to create a new ID
2. Fill in Name of your app (i.e SantenCubeApp)
3. Use Explicit App ID, Bundle ID should follow this notation: com.fishawack.(lowercase of name filled above) i.e. com.fishawack.santencubeapp
4. Check any services you require (normally none of them)
5. Confirm and regster your app

#### Create Provision Profile

1. Go to Provisioning Profiles > All > click the "+" to create a new profile
2. Select "In House", click "Continue"
3. App ID select the one you just created in the last section, click "Continue"
4. Select the Certificate with the longest expiry date and continue
5. Profile name: use App name from previous section and continue
6. Download provisioning profile!

### Create App in PhoneGap Build

1. Login via [PhoneGap Build]( https://build.phonegap.com/apps )
2. Go to top right corner where the account icon is, in the drop down select "Edit Account"
3. Under "Signing Keys", Add a key in the iOS section
4. Use the name you've been using in these sections again and upload the certificate and keys
5. Go back to the main Dashboard and Create new app by uploading a zip file
6. In the App. you can now select your Key for iOS and trigger a build, you will need to unlock it first by clicking the pad lock

You're all done, you should be able to populate your repo with the info provided on the page, add this to your content.json under the attributes object:

```json
"phonegap": {
    "signingKey": "SigningKeyGoesHere",
        "appID": "AppIDGoesHere",
        "phonegapVersion": "cli-7.1.0",
        "bundle": "com.fishawack.AppNameGoesHere"
}
```

## Changelog

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
* Bumped `grunt-svg-sprite` as it suddenly started throwin an error

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
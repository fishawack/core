## Background

### What

This repo contains the code that fetches assets, bundles code and deploys it to the server.

### Why

As a company we do a lot of smaller short term builds rather than longer term code bases. To keep code bases small we create many smaller repo's rather than branching projects in a larger monorepo. For this reason we ended up with lots of duplicate task runner code in each repo that had to be manually updated if any projects came back from the dead further down the line. Around 2014 all of that code was pulled to a shared npm module which meant a massive reduction in code repetition throughout all of our code bases.

## Dependancies

As this code base is shared amongst most of our repos, these dependancies are likely the only ones you'll ever need to install to get project code up and running. They've been split into two groups, build and deploy dependancies.

### Build dependancies

The following dependancies are needed to pull assets from the server and build the source code.

* Node (v10.0.0 recommended)
* Npm
* grunt-cli
* git
* wget
* imagemagick
* jq
* ftp (mac high sierra and above)
* xCode command line tools

### Deploy dependancies

These dependancies are only needed if you're planning to build a pdf locally or manually deploy to the server.

* ghostscript
* wine
* xquartz
* java8
* python (windows only)
* composer

## Getting started

### Mac

* Install brew - [http://brew.sh/](http://brew.sh/) - then use to install the following
    * `brew install git`
    * `brew install wget`
    * `brew install imagemagick`
    * `brew insatll ghostscript`
    * `brew install wine`
    * `brew install jq`
    * `brew install tnftp tnftpd telnet telnetd`
    * `brew install cask`
    * `brew cask install java8`
    * `brew cask install xquartz`
* Install Nvm - [https://github.com/creationix/nvm](https://github.com/creationix/nvm) - then use to install
    * `nvm install 10.0.0`
    * `npm install grunt-cli -g`
* Install composer [https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx)

### Windows

* Install choco - [https://chocolatey.org/](https://chocolatey.org/) then use to install the following
    * `choco install git`
    * `choco install wget`
    * `choco install imagemagick`
    * `choco insatll ghostscript`
    * `choco install wine`
    * `choco install jq`
    * `choco install java8`
    * `choco install xquartz`
* Install Nvm - [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
    * `nvm install 10.0.0`
    * `npm install grunt-cli -g`
* Install composer [https://getcomposer.org/doc/00-intro.md#installation-windows](https://getcomposer.org/doc/00-intro.md#installation-windows)

## Credentials

Credentials are needed in the root of each project so that the automated scripts can properly deploy and fetch content from the server. To mitigate the need to manually copy credentials each time we create a folder on the root of each individuals machine that contains their unique creds. The automated script will automatically grab the `id_rsa` found in the default location in `~/.ssh/`. It will then grab any `secret.json` files it needs for which ever server the current project needs to be deployed onto. If it can't find the correct `secret.json` for a server it will silently fail.

### Target folder

Create the target folder in the root of the machine by running the following command.

```sh
mkdir ~/targets
```

There are three types of file that can be found here.

> Remember to add your own usernames and passwords to these files or grab the global ones from the passwords doc

> Make sure to remove the comments from these files

#### `.ftppass`

This file is used for ftp/sftp/ftps details. All details go into this single file in the following format 

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

## Content

We currently keep our binary assets on our fishawack file sharing platform egnyte. Previously we had an onsite server that was used but that has now been deprecated, this doesn't mean you won't still run across repo's using the previous location so it's worth knowing about.

**Current location**
* Name: Egnyte
* Protocol: `ftps`
* Path: `Shared/FW/Knutsford/Digital/Auto-Content/`

**Old location**
* Name: eSource box
* Protocol: `ftp`
* Path: `Auto-Content/`

The `Auto-Content` folder contains folders with the same names as the repo names in bitbucket. Some products have a parent folder e.g. `Wave` that contains all waves as not to clutter up the `Auto-Content` folder with instances.

### Media

Inside the repo named folder you will usually find a media folder. Any files inside this media folder will get pulled through and be available to the front end via image tags / sass resolves. Anything outside the media folder will still get pulled into the repo but won't be included in the front end bundled files. The primary use case for this are excel files / pre process files that are used in the build phase but not needed in the final site.

Here is a common structure you're likely to see in the Auto-Content location.

```
.../Auto-Content/myapp/media/images/background.jpg
.../Auto-Content/myapp/media/fonts/Roboto.woff
.../Auto-Content/myapp/media/videos/video.webm
.../Auto-Content/myapp/data/piechart.xls
```

#### Binary files

All binary assets (jpg,png,mp4) should **not** be kept in version control. Not only was git not really designed for these types of files but they can also greatly inflate the size of a repo. These are the files that should be kept on the file sharing servers and pulled into the repo via file transfers.

#### Non binary files

Non binary assets (json,svg,xml) should be kept in version control by being placed into `_Build/media/` location. This folder isn't ignored by git, only the `_Build/content/` folder is which is where the files pulled by the server are placed before they're copied to the `_Output/media` folder on build.

> Note even though the files are placed in the git ignored `_Build/content/media` when pulled from the server, they are placed in `_Output/media` without the parent content folder when bundled

## Javascript

All js files should be kept in `_Build/js/`.

The default entry point is `script.js` which is automatically requested in the body of the default html.

#### Multiple entry points

To create another entry point simply create a new javascript file and prefix it with a double hyphen `--`. A file with the same name excluding the hypens will then be generated in the `_Output` folder.

> Remember to include the script tag in the html to import this new file

```
_Build/js/--newEntry.js   >>   _Output/js/newEntry.js
```

#### Imports

Both es6 imports and CommonJS imports are supported. When requiring a javascript file that doesn't contain a default es6 export you need to specify the default property on the returned object.

```js
// Bad
var lib = require('es6-file-with-no-default-export.js');

// Good
var lib = require('es6-file-with-no-default-export.js').default;
```

#### Crucial

Not so important anymore (any maybe deprecated soon) but any file that needs to be included in the head of the document and thus before the rest of the document is ready should be defined with a double underscore `__`. The primary use case for this is modernizr which according to the docs should be imported in the head of the document before the other scripts have run. Modernizr itself has its own workflow outlined elsewhere in this documentation.

```
_Build/js/__important.js   >>   _Output/js/crucial.js
```

#### Linting

JSHint is used to lint against all javascript files in the `_Build/js/` folder excluding those found in `_Build/js/libs/`. This purpose of this folder is to drop any scripts that aren't authored by ourselves and therefore don't need to adhere to our linting as they likely used their own. This again isn't so important anymore as most js libraries will be imported from `node_modules` but if you do have the actual file and need it locally in the repo then this folder is where you'd put it.

## Css

All sass files should be kept in `_Build/sass/`.

The default entry point is `general.scss` which is automatically requested in the head of the default html.

#### Multiple entry points

To create another entry point simply create a new sass file and exclude the standard sass underscore `_` prefix. A file with the same name will be generated in the `_Output` folder.

> Remember to include the link tag in the html to import this new file

```
_Build/sass/newEntry.scss   >>   _Output/css/newEntry.css
```

### Autoprefixing

You **don't** need to prefix any css properties.

### Uncss

Classes that aren't present in any html files **before** javascript runs are considered redundant and are removed from the final bundled css file.

```html
<div class="class1"></div>
```

```css
// Will appear in final css file
.class1{
    ...
}

// Will be removed from final css file
.class2{
    ...
}
```

There are a few keywords that are globally immnue from being stripped from the css.

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

```css
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

```css
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

### Handlebars

## Svg

## Modernizr

## Testing

## Pdf

* Webdriver IO is used to capture screenshots of pages and states, pulling these images into a pdf document. (http://v4.webdriver.io/v4.8/api.html).
* The general automation process, once working, is as follows:
    
    1. capturePage.js file will add the _?capture=true#_ query string to every page incrementally (you can also add functions to check for specific cp- classes in this file, which can then be called in capturePage function).
    
    2. script.js will check to see if capture query string has been set to true and if so, the capture class will be added to the html element and window.capture will be set to true.

### Guidelines

1. Create a staging object in the _Build/content.json file, resembling the below:

```json
"staging": {
    "url": "http://digital-internal.fishawack.staging/Bespoke/",
    "location": "/srv/www/digital-internal.fishawack.staging/public/Bespoke/",
    "ssh": "dumbledore",
    "subDir": "{PROJECTNAME}",
    "pdf": "test/sd/hd"
}
```

2. Create a _Node folder outside of _Build with a capturePage.js file. An example would be the following (hardcore or loop through all pages, adding them to the pages array):
    
```js
module.exports = function(grunt) {
    var delay = 50;
    var index = 0;
    var captureIndex = 0;

    var pages = [
        '/'
    ];

    this.capturePage = function(){
        describe('pdf', function () {
            it('Screenshot', function(done) {
                browser.url('http://localhost:9001/index.html?capture=true#' + pages[index]);

                browser.waitForExist('.loaded', 2000);

                browser.pause(delay);

                browser.saveDocumentScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

                captureRefs();

                index += 1;

                if(index < pages.length){
                    capturePage();
                } else {
                    createPdfsAndZips();
                }
            });
        });
    };

    this.captureRefs = function(){
        if(browser.isExisting('.cp-refs')){
            browser.click('.cp-refs');

            browser.pause(delay);

            browser.saveDocumentScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

            browser.click('.cp-close');
        }
    }
}
```

3. Make sure all animation durations, setTimeouts or custom styles are removed, where necessary, in order to ensure all content can be captured in screenshots. Add styles with a "cp-" prefix to make changes if needed.

4. Make sure the project has been built with an output folder and run the following command: `$grunt pdf`. ($grunt being an alias for `grunt --gruntfile node_modules/@fishawack/config-grunt/Gruntfile.js`).

## Deploying
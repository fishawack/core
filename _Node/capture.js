'use strict';

var fs = require('fs-extra');
const path = require('path');

fs.mkdirpSync(`.tmp/screenshots/`);

var custom = {};
var ignoreDirs = ['.hidden','css','js','media'];

// Load custom capture code in level-0 folder if exists
if(fs.existsSync(process.cwd() + '/_Node/level-0/capture.js')){
    custom = require(process.cwd() + '/_Node/level-0/capture.js');
// Load custom capture code in root _Node folder
} else if(fs.existsSync(process.cwd() + '/_Node/capture.js')){
    custom = require(process.cwd() + '/_Node/capture.js');
}

var capture = {
    url: browser.desiredCapabilities.url,
    wait: browser.desiredCapabilities.wait,
    size: {
        array: null,
        index: 0,
        browser: '',
        width: 0,
        height: 0,
        init(){
            capture.size.index = browser.desiredCapabilities.index;
            capture.size.width = browser.desiredCapabilities.size[0];
            capture.size.height = browser.desiredCapabilities.size[1];
            capture.size.browser = browser.desiredCapabilities.browserName;
        },
        call(){
            capture.size.init();

            describe(`Size ${capture.size.width}x${capture.size.height}`, function () {
                before(() => capture.size.before());

                if(custom.size){
                    custom.size(capture);
                }
                for(var i = 0; i < capture.page.array.length; i++){
                    capture.page.call(i);
                }
            });
        },
        before(){
            capture.size.init(capture.size.index);
            capture.screenshot.init();

            fs.mkdirpSync(`.tmp/screenshots/${capture.screenshot.path}/`);

            browser.setViewportSize({
                width: capture.size.width,
                height: capture.size.height
            });
        }
    },
    page: {
        array: null,
        index: 0,
        name: '',
        slug: '',
        init(index){
            capture.page.index = index;
            capture.page.name = capture.page.array[index];
            capture.page.slug = slugify(capture.page.name);
            var full = capture.page.array[index].split('#')[0] || '';
            capture.page.hash = capture.page.array[index].split('#')[1] || '/';

            capture.page.route = full.split('?')[0] || '/index.html';
            capture.page.query = full.split('?')[1] || '';
        },
        call(index){
            capture.page.init(index);

            describe(`Page ${capture.page.array[index]}`, function () {
                before(() => capture.page.before(index));

                capture.page.initial();

                if(custom.page){
                    custom.page(capture);
                }
            });
        },
        wait() {
            if(isNaN(capture.wait)){
                browser.waitForExist(capture.wait, 50000);
            } else {
                browser.pause(capture.wait);
            }
        },
        before(index){
            capture.page.init(index);

            browser.url(`${capture.url}${capture.page.route}?capture=true&${capture.page.query}#${capture.page.hash}`);

            capture.page.wait()
        },
        initial(){
            it('Loaded', function() {
                capture.screenshot.call();
            });
        }
    },
    screenshot: {
        index: 0,
        path: '',
        init(){
            capture.screenshot.path = `${capture.size.browser}/${capture.size.width}x${capture.size.height}`;
            capture.screenshot.index = 0;
        },
        call(viewportOnly){
            let filename = `.tmp/screenshots/${capture.screenshot.path}/${capture.screenshot.index++}_${capture.page.slug}_`;
            
            if(viewportOnly){
                browser.saveScreenshot(`${filename}.png`);
            } else {
                browser.saveDocumentScreenshot(`${filename}.png`);
            }
        }
    }
};

capture.size.array = browser.desiredCapabilities.sizes;
capture.page.array = browser.desiredCapabilities.pages;

if(capture.page.array.length === 0){
    capture.page.array = findHTML('./_Output');
}

capture.size.call();

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function findHTML(dir, parent = '/') {
    var html = [];
    var pages = fs.readdirSync(dir, {withFileTypes: true});
    pages.forEach(file => {
        if(ignoreDirs.indexOf(file.name) === -1)
        {
            if(path.extname(file.name) === '.html' && !file.isSymbolicLink()){
                html.push(parent + file.name);
            } else if(path.extname(file.name) === '')
            {
                html = html.concat(findHTML(dir+parent+file.name,parent+file.name+'/'));
            }
        }
    });
    return html;
}
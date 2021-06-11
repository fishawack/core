'use strict';

var fs = require('fs-extra');

fs.mkdirpSync(`.tmp/screenshots/`);

var custom = {};

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
        init: function(){
            capture.size.index = browser.desiredCapabilities.index;
            capture.size.width = browser.desiredCapabilities.size[0];
            capture.size.height = browser.desiredCapabilities.size[1];
            capture.size.browser = browser.desiredCapabilities.browserName;
        },
        call: function(){
            capture.size.init();

            describe(`Size ${capture.size.width}x${capture.size.height}`, function () {
                before(function(){
                    capture.size.init(capture.size.index);
                    capture.screenshot.init();

                    fs.mkdirpSync(`.tmp/screenshots/${capture.screenshot.path}/`);

                    browser.setViewportSize({
                        width: capture.size.width,
                        height: capture.size.height
                    });
                });

                if(custom.size){
                    custom.size(capture);
                }

                for(var i = 0; i < capture.page.array.length; i++){
                    capture.page.call(i);
                }
            });
        }
    },
    page: {
        array: null,
        index: 0,
        name: '',
        slug: '',
        init: function(index){
            capture.page.index = index;
            capture.page.name = capture.page.array[index];
            capture.page.slug = slugify(capture.page.name);

            var full = capture.page.array[index].split('#')[0] || '';
            capture.page.hash = capture.page.array[index].split('#')[1] || '/';

            capture.page.route = full.split('?')[0] || '/index.html';
            capture.page.query = full.split('?')[1] || '';
        },
        call: function(index){
            capture.page.init(index);

            describe(`Page ${capture.page.array[index]}`, function () {
                before(function(){
                    capture.page.init(index);

                    browser.url(`${capture.url}${capture.page.route}?capture=true&${capture.page.query}#${capture.page.hash}`);

                    if(isNaN(capture.wait)){
                        browser.waitForExist(capture.wait, 50000);
                    } else {
                        browser.pause(capture.wait);
                    }
                });

                it('Loaded', function() {
                    capture.screenshot.call();
                });

                if(custom.page){
                    custom.page(capture);
                }
            });
        }
    },
    screenshot: {
        index: 0,
        path: '',
        init: function(){
            capture.screenshot.path = `${capture.size.browser}/${capture.size.width}x${capture.size.height}`;
            capture.screenshot.index = 0;
        },
        call: function(viewportOnly){
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

capture.size.call();

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
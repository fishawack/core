'use strict';

var fs = require('fs-extra');
const path = require('path');

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
    url: browser.requestedCapabilities.url,
    wait: browser.requestedCapabilities.wait,
    size: {
        array: null,
        index: 0,
        browser: '',
        width: 0,
        height: 0,
        init(){
            capture.size.index = browser.requestedCapabilities.index;
            capture.size.width = browser.requestedCapabilities.size[0];
            capture.size.height = browser.requestedCapabilities.size[1];
            capture.size.browser = browser.requestedCapabilities.browserName;
        },
        call(){
            capture.size.init();

            describe(`Size ${capture.size.width}x${capture.size.height}`, () => {
                before(async () => await capture.size.before());

                if(custom.size){
                    custom.size(capture);
                }
                
                for(var i = 0; i < capture.page.array.length; i++){
                    capture.page.call(i);
                }
            });
        },
        async before(){
            capture.size.init(capture.size.index);
            capture.screenshot.init();

            fs.mkdirpSync(`.tmp/screenshots/${capture.screenshot.path}/`);

            await browser.setWindowSize(capture.size.width, capture.size.height);
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

            describe(`Page ${capture.page.array[index]}`, () => {
                before(async () => await capture.page.before(index));

                capture.page.initial();

                if(custom.page){
                    custom.page(capture);
                }
            });
        },
        async wait() {
            if(isNaN(capture.wait)){
                await $(capture.wait).waitForExist(50000)
            } else {
                await browser.pause(capture.wait);
            }
        },
        async before(index){
            capture.page.init(index);

            await browser.url(`${capture.url}${capture.page.route}?capture=true&${capture.page.query}#${capture.page.hash}`);

            await capture.page.wait();
        },
        initial(){
            it('Loaded', async function() {
                await capture.screenshot.call();
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
        async call(viewportOnly){
            let filename = `.tmp/screenshots/${capture.screenshot.path}/${capture.screenshot.index++}_${capture.page.slug}_`;
            
            if(viewportOnly){
                await browser.saveScreenshot(`${filename}.png`);
            } else {
                const puppeteer = await browser.getPuppeteer()
                const pages = await puppeteer.pages()
                return pages[0].screenshot({ path: `${filename}.png`, fullPage: true })
            }
        }
    }
};

capture.size.array = browser.requestedCapabilities.sizes;
capture.page.array = browser.requestedCapabilities.pages;

capture.size.call();

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
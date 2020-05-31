'use strict';

var grunt = require('grunt');
var fs = require('fs-extra');
require('../_Tasks/helpers/include.js')(grunt, true);
require('./createPdfsAndZips.js')(grunt);

initConfig();

fs.mkdirpSync('_Pdfs');
fs.mkdirpSync(`.tmp/screenshots/`);

var custom = {};

if(fileExists('capture.js', '_Node', grunt)){
    custom = require(process.cwd() + '/_Node/capture.js');
}

var capture = {
    url: captureEnv().url,
    wait: captureEnv().wait,
    size: {
        array: null,
        index: 0,
        browser: '',
        width: 0,
        height: 0,
        init: function(index){
            capture.size.index = index;
            capture.size.width = capture.size.array[index][0];
            capture.size.height = capture.size.array[index][1];
            capture.size.browser = browser.desiredCapabilities.browserName;
        },
        call: function(index){
            capture.size.init(index);

            describe(`Size ${capture.size.width}x${capture.size.height}`, function () {
                before(function(){
                    capture.size.init(index);
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

                describe(`Archiving and packing`, function () {
                    it(`Merging & optimizing pdfs`, function() {
                        browser.call(() => {
                            return createPdfsAndZips(
                                    capture.screenshot.path,
                                    '.tmp/screenshots',
                                    `${config.filename}_${capture.size.width}x${capture.size.height}_${capture.size.browser}.pdf`
                                );
                        });
                    });
                });
            });
        }
    },
    page: {
        array: null,
        index: 0,
        name: '',
        init: function(index){
            capture.page.index = index;
            capture.page.name = capture.page.array[index];

            var full = capture.page.array[index].split('#')[0] || '';
            capture.page.hash = capture.page.array[index].split('#')[1] || '/';

            capture.page.route = full.split('?')[0] || 'index.html';
            capture.page.query = full.split('?')[1] || '';
        },
        call: function(index){
            capture.page.init(index);

            describe(`Page ${capture.page.array[index]}`, function () {
                before(function(){
                    capture.page.init(index);

                    browser.url(`${capture.url}/${capture.page.route}?capture=true&${capture.page.query}#${capture.page.hash}`);

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
        template: '.tmp/screenshots/<%= capture.screenshot.path %>/<%= capture.screenshot.index++ %>',
        init: function(){
            capture.screenshot.path = `${capture.size.browser}/${capture.size.width}x${capture.size.height}`;
            capture.screenshot.index = 0;
        },
        call: function(viewportOnly){
            let filename = grunt.template.process(capture.screenshot.template, {data: {capture}});
            
            if(viewportOnly){
                browser.saveScreenshot(`${filename}.png`);
            } else {
                browser.saveDocumentScreenshot(`${filename}.png`);
            }
        }
    }
};

capture.size.array = captureEnv().sizes;
capture.page.array = captureEnv().pages;

for(var i = 0; i < capture.size.array.length; i++){
    capture.size.call(i);
}
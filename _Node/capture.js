'use strict';

var grunt = require('grunt');
var fs = require('fs-extra');
require('../_Tasks/helpers/include.js')(grunt, true);
require('./createPdfsAndZips.js')(grunt);

fs.mkdirpSync('_Pdfs');

var custom;

if(fileExists('capture.js', '_Node', grunt)){
    custom = require(process.cwd() + '/_Node/capture.js');
}

var capture = {
    size: {
        array: null,
        index: 0,
        browser: '',
        width: 0,
        height: 0,
        call: function(index){
            describe(`Size ${sizes[index][0]}x${sizes[index][1]}`, function () {
                before(function(){
                    capture.size.index = index;
                    capture.size.width = sizes[index][0];
                    capture.size.height = sizes[index][1];
                    capture.size.browser = browser.desiredCapabilities.browserName;
                    
                    capture.screenshot.index = 0;

                    fs.mkdirpSync(`.tmp/screenshots/`);

                    browser.setViewportSize({
                        width: capture.size.width,
                        height: capture.size.height
                    });
                });

                if(custom.size){
                    custom.size(capture);
                }

                for(var i = 0; i < pages.length; i++){
                    capture.page.call(i);
                }

                createPdfsAndZips(capture);

                after(function(){
                    fs.removeSync(`.tmp/screenshots/`);
                });
            });
        }
    },
    page: {
        array: null,
        index: 0,
        name: '',
        call: function(index){
            describe(`Page ${pages[index]}`, function () {
                before(function(){
                    capture.page.index = index;
                    capture.page.name = pages[index];

                    browser.url(`http://localhost:9001/${capture.page.name}?capture=true`);
                    browser.waitForExist('.loaded', 50000);
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
        call: function(viewportOnly){
            if(!viewportOnly){
                browser.saveScreenshot(`.tmp/screenshots/${capture.screenshot.index++}.png`);
            } else {
                browser.saveDocumentScreenshot(`.tmp/screenshots/${capture.screenshot.index++}.png`);
            }
        }
    }
};

var sizes = capture.size.array = deployEnv.pdf && deployEnv.pdf.sizes || [[1080, 608]];
var pages = capture.page.array = deployEnv.pdf && deployEnv.pdf.pages || ['index.html'];

for(var i = 0; i < sizes.length; i++){
    capture.size.call(i);
}
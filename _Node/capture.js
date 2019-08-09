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
        index: 0,
        browser: '',
        width: 0,
        height: 0,
        call: function(){
            var width = capture.size.width;
            var height = capture.size.height;

            describe(`Size ${width}x${height}`, function () {
                before(function(){
                    fs.mkdirpSync(`.tmp/screenshots/`);

                    browser.setViewportSize({
                        width: width,
                        height: height
                    });

                    capture.screenshot.index = 0;
                });

                if(custom.size){
                    custom.size(capture);
                }

                for(var i = 0; i < pages.length; i++){
                    capture.page.index = i;
                    capture.page.name = pages[i];
                    capture.page.call();
                }

                createPdfsAndZips(capture);

                after(function(){
                    fs.removeSync(`.tmp/screenshots/`);
                });
            });
        }
    },
    page: {
        index: 0,
        name: '',
        call: function(){
            var page = capture.page.name;
            
            describe(`Page ${page}`, function () {
                before(function(){
                    browser.url(`http://localhost:9001/${page}?capture=true`);
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

var sizes = deployEnv.pdf && deployEnv.pdf.sizes || [[1080, 608]];
var pages = deployEnv.pdf && deployEnv.pdf.pages || ['index.html'];

for(var i = 0; i < sizes.length; i++){
    capture.size.index = i;
    capture.size.width = sizes[i][0];
    capture.size.height = sizes[i][1];
    capture.size.browser = browser.desiredCapabilities.browserName;
    capture.size.call();
}
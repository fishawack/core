'use strict';

var grunt = require('grunt');
var fs = require('fs-extra');
require('../_Tasks/helpers/include.js')(grunt, true);
require('./createPdfsAndZips.js')(grunt);

fs.mkdirpSync('_Pdfs');
fs.mkdirpSync(`.tmp/screenshots/`);

var custom = {};

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

                createPdfsAndZips(capture);
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
        },
        call: function(index){
            capture.page.init(index);

            describe(`Page ${capture.page.array[index]}`, function () {
                before(function(){
                    capture.page.init(index);

                    var page = capture.page.array[index].split('#')[0] || 'index.html';
                    var hash = capture.page.array[index].split('#')[1] || '/';

                    browser.url(`http://localhost:9001/${page}?capture=true#${hash}`);
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
        path: '',
        init: function(){
            capture.screenshot.path = `${capture.size.browser}/${capture.size.width}x${capture.size.height}`;
            capture.screenshot.index = 0;
        },
        call: function(viewportOnly){
            if(viewportOnly){
                browser.saveScreenshot(`.tmp/screenshots/${capture.screenshot.path}/${capture.screenshot.index++}.png`);
            } else {
                browser.saveDocumentScreenshot(`.tmp/screenshots/${capture.screenshot.path}/${capture.screenshot.index++}.png`);
            }
        }
    }
};

capture.size.array = deployEnv.pdf && deployEnv.pdf.sizes || [[1080, 608]];
capture.page.array = deployEnv.pdf && deployEnv.pdf.pages || ['index.html'];

for(var i = 0; i < capture.size.array.length; i++){
    capture.size.call(i);
}
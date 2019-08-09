'use strict';

var grunt = require('grunt');
var fs = require('fs-extra');
require('../_Tasks/helpers/include.js')(grunt, true);
require('./createPdfsAndZips.js')(grunt);

fs.mkdirpSync('_Pdfs');

if(fileExists('capturePage.js', '_Node', grunt)){
    require(process.cwd() + '/_Node/capturePage.js')(grunt);
}

var captureIndex;

var sizes = [[1080, 608]];
if(deployEnv.pdf && deployEnv.pdf.sizes){
    sizes = deployEnv.pdf.sizes;
}

var pages = ['index.html'];
if(deployEnv.pdf && deployEnv.pdf.pages){
    pages = deployEnv.pdf.pages;
}

for(var i = 0; i < sizes.length; i++){
    var width = sizes[i][0];
    var height = sizes[i][1];

    captureSize(
        width,
        height
    );
}

function captureSize(width, height){
    describe(`Size ${width}x${height}`, function () {
        before(function(){
            fs.mkdirpSync(`.tmp/screenshots/`);
        });

        it('init', function() {
            browser.setViewportSize({
                width: width,
                height: height
            });

            captureIndex = 0;
        });

        if(typeof capturePage === "function"){
            capturePage();
        } else {
            for(var i = 0; i < pages.length; i++){
                asdf(i);
            }
        }

        createPdfsAndZips(
            browser.desiredCapabilities.browserName,
            width,
            height
        );

        after(function(){
            fs.removeSync(`.tmp/screenshots/`);
        });
    });
}

function asdf(index){
    var page = pages[index];

    describe(`Page ${page}`, function () {
        it('screenshot', function() {
            browser.url(`http://localhost:9001/${page}?capture=true`);

            browser.waitForExist('.loaded', 50000);

            browser.saveScreenshot(`.tmp/screenshots/${captureIndex++}.png`);
        });
    });
}
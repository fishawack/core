'use strict';

var grunt = require('grunt');
require('../_Tasks/helpers/include.js')(grunt, true);
require('./createPdfsAndZips.js')(grunt);

if(fileExists('capturePage.js', '_Node', grunt)){
    require(process.cwd() + '/_Node/capturePage.js')(grunt);
}

grunt.file.mkdir('.tmp/screenshots/');

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
    captureSize(i);
}

createPdfsAndZips(sizes);

function captureSize(index){
    grunt.file.mkdir(`.tmp/screenshots/${index}/`);

    var width = sizes[index][0];
    var height = sizes[index][1];

    describe(`Size ${width}x${height}`, function () {
        it('init', function() {
            browser.setViewportSize({
                width: width,
                height: height
            });

            captureIndex = 0;
        });

        for(var i = 0; i < pages.length; i++){
            capturePage(i, index);
        }
    });
}

function capturePage(index, sizeIndex){
    var page = pages[index];

    describe(`Page ${page}`, function () {
        it('screenshot', function() {
            browser.url(`http://localhost:9001/${page}?capture=true`);

            browser.waitForExist('.loaded', 50000);

            browser.saveDocumentScreenshot(`.tmp/screenshots/${sizeIndex}/${captureIndex++}.png`);
        });
    });
}
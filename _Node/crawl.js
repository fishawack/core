'use strict';

var grunt = require('grunt');
require('../_Tasks/helpers/include.js')(grunt, true);
require('./createPdfsAndZips.js')(grunt);

if(fileExists('capturePage.js', '_Node', grunt)){
    require(process.cwd() + '/_Node/capturePage.js')(grunt);
}

var delay = 50;
var captureIndex = 0;

grunt.file.mkdir('.tmp/screenshots/');

var qualitySizes = {
    '16:9': {
    	hd: [1920, 1080],
    	hd_retina: [960, 540],
    	sd: [1080, 608],
    	test: [16, 9]
    },
    '9:16': {
        hd: [1080, 1920],
        hd_retina: [540, 960],
        sd: [608, 1080],
        test: [9, 16]
    },
    '4:3': {
        hd: [1366, 1024],
        hd_retina: [683, 512],
        sd: [1024, 768],
        test: [20, 15]
    },
    '3:4': {
        hd: [1024, 1366],
        hd_retina: [512, 683],
        sd: [768, 1024],
        test: [15, 20]
    }
};

var ratio = '16:9';

var quality = 'sd';

if(typeof deployEnv.pdf === 'string'){
    quality = deployEnv.pdf;

    if(contentJson.attributes.ratio){
        ratio = contentJson.attributes.ratio;
    }
}

browser.setViewportSize({
    width: qualitySizes[ratio][quality][0],
    height: qualitySizes[ratio][quality][1]
});

if(typeof capturePage === 'function'){
    capturePage();
} else {
    describe('pdf', function () {
        it('Screenshot', function() {
            browser.url('http://localhost:9001/index.html?capture=true');

            browser.waitForExist('.loaded', 50000);
            
            browser.pause(delay);

            browser.saveDocumentScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

            createPdfsAndZips();
        });
    });
}
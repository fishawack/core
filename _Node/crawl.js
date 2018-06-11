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
    '4:3': {
        hd: [1366, 1024],
        hd_retina: [683, 512],
        sd: [1024, 768],
        test: [20, 15]
    }
};

var ratio = '16:9';

var quality = 'sd';

if(typeof deployEnv.pdf === 'string'){
    quality = deployEnv.pdf;

    if(deployEnv.ratio){
        ratio = deployEnv.ratio;
    }
}

browser.setViewportSize({
    width: qualitySizes[ratio][quality][0],
    height: qualitySizes[ratio][quality][1]
});

if(typeof capturePage === 'function'){
    capturePage();
} else {
    describe('Base', function () {
        it('Screenshot Page / Refs / Foots', function() {
            browser.url('http://localhost:9001/index.html?capture=true');

            browser.waitForExist('.loaded', 50000);
            
            browser.pause(delay);

            browser.saveScreenshot(".tmp/screenshots/" + (captureIndex++) + ".png");

            createPdfsAndZips();
        });
    });
}
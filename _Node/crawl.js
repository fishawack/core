'use strict';

var grunt = require('grunt');
require('../_Tasks/helpers/include.js')(grunt);
require('./createPdfsAndZips.js')(grunt);

if(fileExists('capturePage.js', '_Node', grunt)){
    require(process.cwd() + '/_Node/capturePage.js')(grunt);
}

var delay = 50;
var captureIndex = 0;

grunt.file.mkdir('.tmp/screenshots/');

var qualitySizes = {
	hd: [1920, 1080],
	hd_retina: [960, 540],
	sd: [1080, 608],
	test: [16, 9]
};

var quality = 'sd';

if(typeof deployEnv.pdf === 'string'){
    quality = deployEnv.pdf;
}

browser.setViewportSize({
    width: qualitySizes[quality][0],
    height: qualitySizes[quality][1]
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
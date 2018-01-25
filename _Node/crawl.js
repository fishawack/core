'use strict';

var grunt = require('grunt');
require('../_Tasks/helpers/include.js')(grunt);
require('./capturePage.js')(grunt);
require('./createPdfsAndZips.js')(grunt);

var qualitySizes = {
	hd: [1920, 1080],
	hd_retina: [960, 540],
	sd: [1080, 608],
	test: [16, 9]
};

var quality = 'sd';

browser.setViewportSize({
    width: qualitySizes[quality][0],
    height: qualitySizes[quality][1]
});

capturePage();
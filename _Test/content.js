'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('content', () => {
    before(() => {
        execSync('grunt clean:content content:pull --mocha=output', opts);
    });
    
    it('Should pull down assets via lftp', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;
    });

    it('Should pull down assets via ftps', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Build/content/content-1/**/*'))).to.be.an('array').that.is.not.empty;
    });
});

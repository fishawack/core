'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const opts = {encoding: 'utf8', stdio: 'pipe'};

describe('content', () => {
    before(() => {
        execSync('grunt content --mocha=output', opts);
    });
    
    it('Should pull down assets via lftp', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;
    });

    it('Should pull down assets via ftps', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Build/content/content-1/**/*'))).to.be.an('array').that.is.not.empty;
    });
});

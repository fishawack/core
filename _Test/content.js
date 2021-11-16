'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const opts = {encoding: 'utf8', stdio: 'inherit'};

describe('capture', () => {
    before(() => {
        execSync('grunt content --mocha=output', opts);
    });
    
    it('Should pull down assets via lftp', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Build/content/**/*'))).to.be.an('array').that.is.not.empty;
    });
});

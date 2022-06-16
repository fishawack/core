'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('content', () => {    
    it('Should pull down assets via lftp', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=lftp', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;
    });

    it('Should pull down assets via ftps', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=ftps', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;
    });
});

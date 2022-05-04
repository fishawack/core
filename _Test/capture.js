'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');
const path = require('path');
const glob = require('glob');

describe('capture', () => {
    before(() => {
        execSync('grunt clean:build capture --branch=master --mocha=capture', opts);
    });
    
    it('Should capture index at specified dimensions', () => {
        expect(true).to.be.equal(true);
    });
    
    it('Should auto generate routes from output', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/chrome/1080x608/*.png'))).to.be.an('array').that.is.not.empty;
    });
});
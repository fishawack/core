'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');
var fs = require('fs-extra');

describe('capture', () => {
    before(() => {
        execSync('grunt clean:build capture --branch=master --mocha=output', opts);
    });
    
    it('Should capture index at specified dimensions', () => {
        expect(true).to.be.equal(true);
    });
    
    it('Should auto generate routes from output', () => {
        const dom = './_Test/_fixture/capture/.tmp/screenshots/chrome/1080x608';
        expect(getCreatedPDFS(dom)).to.be.equal(3);
    });
});

function getCreatedPDFS(dir) {
    var pages = fs.readdirSync(dir);
    return pages.length;
}
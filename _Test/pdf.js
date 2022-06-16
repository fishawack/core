'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('pdf', () => {
    before(() => {
        execSync('grunt clean:build clean:pdf capture --branch=master --mocha=capture', opts);
    });
    
    it('Should generate a pdf file', () => {
        execSync('grunt pdf --branch=master --mocha=capture', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/capture/_Pdfs/*_chrome.pdf'))).to.be.an('array').that.is.not.empty;
    });

    it('Should compare browsers', () => {
        execSync('grunt compare:browsers --branch=master --mocha=capture', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/capture/_Build/media/generated/__chrome - chrome.png'))).to.be.an('array').that.is.not.empty;
        expect(glob.sync(path.join(__dirname, '_fixture/capture/_Build/media/generated/__chrome - chrome.svg'))).to.be.an('array').that.is.not.empty;
    });

    it('Should compare the latest build against the last', () => {
        execSync('grunt shell:pullPrevious compare:previous shell:pushPrevious --branch=master --mocha=capture', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/capture/_Pdfs/*_chrome_compare.pdf'))).to.be.an('array').that.is.not.empty;
    });
});

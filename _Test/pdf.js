'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

describe('pdf', () => {
    before(() => {
        execSync('grunt clean:build clean:pdf capture --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a pdf file', () => {
        execSync('grunt pdf --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});

        expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Pdfs/*_chrome.pdf'))).to.be.an('array').that.is.not.empty;
    });

    it('Should compare browsers', () => {
        execSync('grunt compare:browsers --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});

        expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Build/media/generated/__chrome - chrome.png'))).to.be.an('array').that.is.not.empty;
        expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Build/media/generated/__chrome - chrome.svg'))).to.be.an('array').that.is.not.empty;
    });

    it('Should compare the latest build against the last', () => {
        execSync('grunt shell:pullPrevious compare:previous shell:pushPrevious --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});

        expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Pdfs/*_chrome_compare.pdf'))).to.be.an('array').that.is.not.empty;
    });
});

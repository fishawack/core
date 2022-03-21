'use strict';

const fs = require('fs');
const glob = require('glob');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('package', () => {    
    it('Should not generate an app zip if app flag not preset on branch', () => {
        execSync('grunt clean:zip clean:pdf package --mocha=package', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/package/_Zips/*_App.zip'))).to.be.an('array').that.is.empty;

        expect(fs.existsSync(path.join(__dirname, '_fixture/package/_Zips'))).to.be.false;
        expect(fs.existsSync(path.join(__dirname, '_fixture/package/_Pdfs'))).to.be.false;
    });

    it('Should generate an app zip if app flag not preset on branch', () => {
        execSync('grunt clean:zip package --mocha=package --branch=package', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/package/_Zips/*_App.zip'))).to.be.an('array').that.is.not.empty;
    });
});

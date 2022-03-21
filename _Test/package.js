'use strict';

const glob = require('glob');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('package', () => {    
    it('Should not generate an app zip if app flag not preset on branch', () => {
        execSync('grunt clean:zip clean:pdf package --mocha=package', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/output/_Zips/*_App.zip'))).to.be.an('array').that.is.empty;
    });

    it('Should generate an app zip if app flag not preset on branch', () => {
        execSync('grunt clean:zip package --mocha=package --branch=package', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/output/_Zips/*_App.zip'))).to.be.an('array').that.is.not.empty;
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const { opts } = require('./_helpers/globals.js');

describe('compress', () => {
    it('Should compress deploy folder to a file called Deploy.zip in the zips directory', () => {
        execSync('grunt clean:zip clean:deploy package:deploy compress:deploy --mocha=output', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/output/_Zips/Deploy.zip'))).to.be.an('array').that.is.not.empty;
    });

    it('Should compress deploy folder to a file called Deploy.zip in the zips directory', () => {
        execSync('grunt clean:zip clean:deploy package:deploy compress:deploy --mocha=output', opts);

        execSync('unzip _Test/_fixture/output/_Zips/Deploy.zip -d _Test/_fixture/output/_Zips/Deploy');

        expect(glob.sync(path.join(__dirname, '_fixture/output/_Zips/Deploy.zip'))).to.be.an('array').that.is.not.empty;

        let stats = fs.lstatSync('_Test/_fixture/output/_Zips/Deploy/symlink.js');

        expect(stats.isSymbolicLink()).to.be.true;
    });
});

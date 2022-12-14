'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('handover', () => {
    before(() => {
        execSync('grunt package:handover --branch=package --mocha=output', opts);
    });
    
    it('Should pull in the build files', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Packages/Handover/_Build/**/*'))).to.be.an('array').that.is.not.empty;
    });
});

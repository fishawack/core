'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

describe('handover', () => {
    before(() => {
        execSync('grunt package:handover --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'inherit'});
    });
    
    it('Should pull in the build files', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Packages/Handover/_Build/**/*'))).to.be.an('array').that.is.not.empty;
    });
});

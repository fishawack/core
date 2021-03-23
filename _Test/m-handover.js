'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

describe('handover', () => {
    before(() => {
        execSync('grunt handover --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should pull in the build files', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Packages/Handover/_Build/**/*'))).to.have.length;
    });
});

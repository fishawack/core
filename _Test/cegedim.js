'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

describe('cegedim', () => {
    before(() => {
        execSync('grunt capture cegedim --branch=package --mocha=output', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a cegedim key message zip', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Packages/Cegedim/*.zip'))).to.be.an('array').that.is.not.empty;
    });
});

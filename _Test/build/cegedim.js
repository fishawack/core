'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('cegedim', () => {
    before(() => {
        execSync('grunt clean:cegedim cegedim --branch=package --mocha=package', opts);
    });
    
    it('Should generate a cegedim key message zip', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Cegedim/*.zip'))).to.be.an('array').that.is.not.empty;
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('veeva', () => {
    before(() => {
        execSync('grunt veeva --branch=package --mocha=output', opts);
    });
    
    it('Should generate a veeva key message zip', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Packages/Veeva/*.zip'))).to.be.an('array').that.is.not.empty;
    });

    it('Should generate a veeva key message ctl file', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/output/_Packages/Veeva/ctlfile/*.ctl'))).to.be.an('array').that.is.not.empty;
    });
});

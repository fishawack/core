'use strict';

const fs = require('fs');
const glob = require('glob');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('karma', () => {
    it('Should pass unit tests', () => {
        expect(() => execSync('grunt karma --mocha=test', {encoding: 'utf8'})).to.not.throw();
    });

    it('Should generate code coverage', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/test/coverage/json-summary.json'))).to.be.an('array').that.is.not.empty;
    });
});

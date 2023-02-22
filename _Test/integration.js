'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');

describe('integration', () => {
    it('Should pass ui tests', () => {
        expect(() => execSync('grunt integration --mocha=test', opts)).to.not.throw();
    });
});

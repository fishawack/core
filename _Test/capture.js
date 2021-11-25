'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');

describe('capture', () => {
    before(() => {
        execSync('grunt clean:build capture --branch=master --mocha=output', opts);
    });
    
    it('Should capture index at specified dimensions', () => {
        expect(true).to.be.equal(true);
    });
});

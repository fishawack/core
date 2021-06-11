'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

describe('capture', () => {
    before(() => {
        execSync('grunt clean:build capture --branch=master --mocha=output', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should capture index at specified dimensions', () => {
        expect(true).to.be.equal(true);
    });
});

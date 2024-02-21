'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('dist', () => {
    it('Should run a production build', () => {
        expect(() => execSync('grunt dist --branch=master --mocha=bundle', opts)).to.not.throw();
    });
});

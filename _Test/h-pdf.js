'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

describe('pdf', () => {
    before(() => {
        execSync('grunt pdf --branch=master --mocha', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a pdf file', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/_Pdfs/*.pdf'))).to.have.length;
    });
});
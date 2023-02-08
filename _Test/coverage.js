'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('coverage', () => {    
    it('Should pull down assets via lftp', () => {
        let output = execSync('grunt coverage --mocha=bundle --branch=master', {encoding: 'utf8'});

        expect(output).to.contain('Code coverage: 0.0%');
    });
});

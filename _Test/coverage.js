'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('coverage', () => {    
    it('Should output the code coverage to terminal', () => {
        let output = execSync('grunt karma coverage --mocha=test', {encoding: 'utf8'});

        expect(output).to.contain('Code coverage: 87.5%');
    });

    it('Should output the code coverage to terminal with no tests', () => {
        let output = execSync('grunt coverage --mocha=bundle --branch=master', {encoding: 'utf8'});

        expect(output).to.contain('Code coverage: 0.0%');
    });
});

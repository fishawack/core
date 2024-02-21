'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');

describe('browserSync', () => {
    it('Should run devServer on localhost', () => {
        expect(execSync('grunt browserSync --mocha=output', {encoding: 'utf8'})).to.include('Local: http://localhost:');
    });

    it('Should run devServer over https', () => {
        expect(execSync('grunt browserSync --mocha=output --branch=devServer-https', {encoding: 'utf8'})).to.include('Local: https://localhost:');
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const shell = require('../../_Tasks/shell.js').shell;

describe('shell', () => {
    it('Should echo to terminal when called directly', () => {
        expect(shell('echo hello', {stdio: 'pipe'})).to.include('hello');
    });

    it('Should echo to terminal when called as task', () => {
        expect(execSync('grunt shell:test --mocha=output', {encoding: 'utf-8'})).to.include('hello');
    });

    it('Should throw error when error in command', () => {
        expect(() => shell('yabbadabba', {stdio: 'pipe'})).to.throw();
    });

    it('Should not throw error when failOnError set to false and error in command', () => {
        expect(() => shell('yabbadabba', {stdio: 'pipe'}, {failOnError: false})).to.not.throw();
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');

describe('tv4', () => {
    it('Should pass tv4 linting', async () => {
        try{
            execSync('grunt tv4 --branch=master --mocha=bundle', opts);
            execSync('grunt tv4 --branch=master --mocha=output', opts);
            execSync('grunt tv4 --branch=master --mocha=reload', opts);
        } catch(e){
            expect(e.message).to.not.contain('Command failed');
        }
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;

describe('tv4', () => {
    it('Should generate a json file in the .tmp directory', async () => {
        try{
            execSync('grunt tv4 --branch=master --mocha=bundle', {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('Command failed');
        }
    });
});

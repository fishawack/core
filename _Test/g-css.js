'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

describe('css', () => {
    before(() => {
        execSync('grunt sass postcss:dev --branch=master --mocha', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a css bundle', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/_Output/css/general.css'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});
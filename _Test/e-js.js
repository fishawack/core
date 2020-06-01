'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

describe('js', () => {
    before(() => {
        execSync('grunt modernizr webpack:dev concat:dev --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a javascript bundle', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/js/script.js'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

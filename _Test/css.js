'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('css', () => {
    before(() => {
        execSync('grunt sass --branch=master --mocha=bundle', opts);
    });
    
    it('Should generate a css bundle', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/css/general.css'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

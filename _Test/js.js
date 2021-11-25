'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('js', () => {
    before(() => {
        execSync('grunt modernizr webpack:dev concat:dev --branch=master --mocha=bundle', opts);
    });
    
    it('Should generate a javascript bundle', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/js/script.js'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

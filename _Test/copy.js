'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('copy', () => {
    before(() => {
        execSync('grunt copy:content copy:assets copy:svg copy:svgasis --branch=master --mocha=bundle', opts);
    });
    
    it('Should copy assets from media folder', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/media/__fishawack.svg'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

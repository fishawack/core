'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

describe('copy', () => {
    before(() => {
        execSync('grunt copy:content copy:assets copy:svg copy:svgasis --branch=master --mocha', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should copy assets from media folder', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/_Output/media/__fishawack.svg'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

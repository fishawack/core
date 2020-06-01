'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

describe('clean', () => {
    before(() => {
        execSync('grunt clean --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should remove _Pdfs folder', () => {
        try{
            fs.readdirSync(path.join(__dirname, '_fixture/bundle/_Pdfs'));
        } catch(e){
            expect(e.message).to.contain('ENOENT');
        }
    });
});

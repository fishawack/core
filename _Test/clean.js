'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('clean', () => {
    before(() => {
        execSync('grunt clean --branch=master --mocha=bundle', opts);
    });
    
    it('Should remove _Pdfs folder', () => {
        try{
            fs.readdirSync(path.join(__dirname, '_fixture/bundle/_Pdfs'));
        } catch(e){
            expect(e.message).to.contain('ENOENT');
        }
    });
});

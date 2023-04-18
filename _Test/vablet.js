'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('vablet', () => {
    before(() => {
        execSync('grunt clean:vablet vablet --branch=package --mocha=package', opts);
    });
    
    it('Should generate a vablet settings file', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/package/_Packages/Vablet/VabletLoadSettings.json'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

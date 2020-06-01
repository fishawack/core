'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

describe('vablet', () => {
    before(() => {
        execSync('grunt vablet --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a vablet settings file', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Packages/Vablet/VabletLoadSettings.json'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

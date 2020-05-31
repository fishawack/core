'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

describe('html', () => {
    before(() => {
        execSync('grunt compile-handlebars htmlmin compile-vue --branch=master --mocha', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a index.html file', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/_Output/index.html'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});
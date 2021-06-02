'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');

describe('sass', () => {
    let css;

    before(() => {
        execSync('grunt clean:cache compile-handlebars:default htmlmin:default sass:default --dist --mocha=bundle', {encoding: 'utf8', stdio: 'inherit'});
    });
    
    it('Should generate a css file in the _Output directory', () => {
        try{
            css = fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/css/general.css'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

    it('Should match expected css output', () => {
        expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general.css'), {encoding: 'utf8'}));
    });
});

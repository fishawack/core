'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('sass', () => {
    let css;

    before(() => {
        execSync('grunt clean:cache compile-handlebars:default htmlmin:default sass:default --dist --mocha=sass', opts);
    });
    
    it('Should generate a css file in the _Output directory', () => {
        try{
            css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

    it('Should match expected css output', () => {
        expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general.css'), opts));
    });

    it('Should not run postcss on branches that do not have a deploy object on the target branch', () => {
        execSync('grunt clean:cache compile-handlebars:default htmlmin:default sass:default --mocha=sass', opts);

        let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
        
        expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general-no-dist.css'), opts));
    });

    it('Should run postcss on branches that do have a deploy object on the target branch', () => {
        execSync('grunt clean:cache compile-handlebars:default htmlmin:default sass:default --mocha=sass --branch=postcss', opts);

        let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
        
        expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general-no-dist-purgecss.css'), opts));
    });
});

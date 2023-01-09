'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('css', () => {
    describe('sass', () => {
        before(() => {
            execSync('grunt sass:default --branch=master --mocha=bundle', opts);
        });

        it('Should generate a css bundle', () => {
            expect(() => fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/css/general.css'), opts)).to.not.throw();
        });

        it('Should render scss files at the root as new entry points', () => {
            expect(() => fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/css/entry.css'), opts)).to.not.throw();
        });

        it('Should not render a scss file for the vendor file', () => {
            expect(() => fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/css/vendor.css'), opts)).to.throw();
        });
    
        it('Should merge contents of vendor and general into single css file', () => {
            expect(fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/css/general.css'), opts)).to.contain('.vendor').and.contain('.general').and.not.contain('.entry');
        });
    });

    describe('postcss', () => {
        it('Should not run postcss', () => {
            execSync('grunt clean:cache compile-handlebars:default htmlmin:default sass:default --mocha=sass', opts);
    
            let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
            
            expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general.css'), opts));
        });
    
        it('Should run postcss on builds with dist flag', () => {
            execSync('grunt clean:cache compile-handlebars:default htmlmin:default sass:default --dist --mocha=sass', opts);
    
            let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
    
            expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general-dist.css'), opts));
        });
    
        it('Should run postcss but not minify on branches that have a deploy target without a dist flag', () => {
            execSync('grunt clean:cache compile-handlebars:default htmlmin:default sass:default --mocha=sass --branch=postcss', opts);
    
            let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
            
            expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general-no-dist-with-target.css'), opts));
        });
    });
});

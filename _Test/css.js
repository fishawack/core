'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('css', () => {
    it('Should generate a css bundle', () => {
        execSync('grunt sass:default --branch=master --mocha=bundle', opts);

        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/css/general.css'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

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

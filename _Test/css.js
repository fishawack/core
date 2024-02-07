'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('css', () => {
    describe('sass', () => {
        before(() => {
            execSync('grunt clean:cache sass:default --branch=master --mocha=bundle', opts);
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
            execSync('grunt clean:cache sass:default --mocha=sass', opts);
    
            let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
            
            expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general.css'), opts));
        });
    
        it('Should run postcss on builds with dist flag', () => {
            execSync('grunt clean:cache sass:default --dist --mocha=sass', opts);
    
            let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
    
            expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general-dist.css'), opts));
        });
    
        it('Should run postcss but not minify on branches that have a deploy target without a dist flag', () => {
            execSync('grunt clean:cache sass:default --mocha=sass --branch=postcss', opts);
    
            let css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/general.css'), opts);
            
            expect(css).to.equal(fs.readFileSync(path.join(__dirname, '_expected/general-no-dist-with-target.css'), opts));
        });

        describe('purgecss', () => {
            let css;

            before(() => {
                execSync('grunt clean:cache sass:default --mocha=sass --dist', opts);
        
                css = fs.readFileSync(path.join(__dirname, '_fixture/sass/_Output/css/purgecss.css'), opts);
            });

            it('Should strip unused class', () => {
                expect(css).to.not.contain('.unused');
            });
            
            it('Should not strip used class', () => {
                expect(css).to.contain('.used');
            });

            it('Should not strip classes containing active within the selector', () => {
                expect(css).to.contain('.active');
            });
            
            it('Should not strip classes containing deactive within the selector', () => {
                expect(css).to.contain('.deactive');
            });
            
            it('Should not strip classes containing disabled within the selector', () => {
                expect(css).to.contain('.disabled');
            });
            
            it('Should not strip classes containing capture within the selector', () => {
                expect(css).to.contain('.capture');
            });
            
            it('Should not strip classes containing lab within the selectorD3', () => {
                expect(css).to.contain('.labD3');
            });
            
            it('Should not strip classes containing color within the selector', () => {
                expect(css).to.contain('.color-1');
            });

            it('Should strip classes containing color within their name', () => {
                expect(css).not.to.contain('.color-2-stacked');
            });
            
            it('Should strip classes containing color in their children', () => {
                expect(css).not.to.contain('.color-3');
            });

            it('Should strip classes containing color in a chained class', () => {
                expect(css).not.to.contain('.color-4');
            });
        });
    });

    it('Should throw error when syntax error found in sass', () => {
        expect(() => execSync('grunt clean:cache sass:default --branch=syntax-error --mocha=bundle', opts)).to.throw();
    })

    it('Should not error on deprecation warning', () => {
        expect(() => execSync('grunt clean:cache sass:default --branch=deprecation --mocha=bundle', opts)).to.not.throw();
    });
});

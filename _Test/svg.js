'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require("glob");
const { opts } = require('./_helpers/globals.js');

describe('svg', () => {
    describe('fontello-svg', () => {
        before(() => {
            execSync('grunt fontello_svg --branch=master --mocha=bundle', opts);
        });
        
        it('Should download icons from fontello.com as svgs', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Build/icons/generated/*.svg'))).to.be.an('array').that.is.not.empty;
        });

        it('Should download icons with custom file format', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Build/icons/generated/spin6.svg'))).to.be.an('array').that.is.not.empty;
        });
    });

    describe('svgfit', () => {
        before(() => {
            execSync('grunt clean:build fontello_svg svgfit --branch=master --mocha=bundle', opts);
        });
        
        it('Should fit svgs to bounds', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/.tmp/icons-fit/*.svg'))).to.be.an('array').that.is.not.empty;
        });
    });
    
    describe('svgmin', () => {
        before(() => {
            execSync('grunt fontello_svg svgfit svgmin --branch=master --mocha=bundle', opts);
        });
        
        it('Should minify & optimize svgs', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/*.svg'))).to.be.an('array').that.is.not.empty;
        });

        describe('full', () => {
            let svg;

            before(() => {
                svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/svg.svg'), {encoding: 'utf8'});
            });

            it('Should not remove viewBox', () => {
                expect(svg).contain('viewBox=');
            });

            it('Should remove width & height', () => {
                expect(svg).to.not.contain(' width=');
                expect(svg).to.not.contain(' height=');
            });

            it('Should prefix ids', () => {
                expect(svg).to.contain('id="id-');
            });

            it('Should remove <style> blocks', () => {
                expect(svg).to.not.contain('<style>');
            });

            it('Should remove useless fill & stroke', () => {
                expect(svg).to.not.contain(' stroke="red"');
                expect(svg).to.not.contain(' stroke-width="0"');
            });

            it('Should remove fill & stroke', () => {
                expect(svg).to.not.contain(' fill="#00f"');
                expect(svg).to.not.contain(' stroke="#00f"');
            });
        })

        describe('minimal', () => {
            let svg;

            before(() => {
                svg = fs.readFileSync(path.join(__dirname, '_fixture/bundle/.tmp/icons-min/--svg.svg'), {encoding: 'utf8'});
            });

            it('Should not remove viewBox', () => {
                expect(svg).contain('viewBox=');
            });

            it('Should remove width & height', () => {
                expect(svg).to.not.contain(' width=');
                expect(svg).to.not.contain(' height=');
            });

            it('Should prefix ids', () => {
                expect(svg).to.contain('id="id-');
            });

            it('Should not remove <style> blocks', () => {
                expect(svg).to.contain('<style>');
            });

            it('Should not remove useless fill & stroke', () => {
                expect(svg).to.contain(' stroke="red"');
                expect(svg).to.contain(' stroke-width="0"');
            });

            it('Should not remove fill & stroke', () => {
                expect(svg).to.contain(' fill="#00f"');
                expect(svg).to.contain(' stroke="#00f"');
            });
        })
    });

    describe('svgsprite', () => {
        before(() => {
            execSync('grunt fontello_svg svgfit svgmin svg_sprite --branch=master --mocha=bundle', opts);
        });
        
        it('Should generate svgSprite.svg', () => {
            try{
                fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Build/handlebars/generated/svgSprite.svg'), opts);
            } catch(e){
                expect(e.message).to.not.contain('ENOENT');
            }
        });
    });
});

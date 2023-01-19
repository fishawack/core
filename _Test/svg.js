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

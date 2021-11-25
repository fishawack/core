'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('svg', () => {
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

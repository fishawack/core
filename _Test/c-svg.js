'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

describe('svg', () => {
    before(() => {
        execSync('grunt fontello_svg svgfit svgmin svg_sprite --branch=master --mocha', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate svgSprite.svg', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/_Build/handlebars/partials/generated/svgSprite.svg'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });
});

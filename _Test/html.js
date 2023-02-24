'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('html', () => {
    before(() => {
        // svgSprite needed for html compile
        execSync('grunt fontello_svg svgfit svgmin svg_sprite --branch=master --mocha=bundle', opts);
        execSync('grunt compile-handlebars htmlmin --branch=master --mocha=bundle', opts);
    });
    
    it('Should generate a index.html file', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/index.html'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

    describe('handlebars', () => {
        let output;

        before(() => {
            output = fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/index.html'), opts);
        });

        it('Should expand mustache brackets', () => {
            expect(output).to.contain('yabba dabba doo');
        });
        
        it('Should expand mustache brackets with environment variables', () => {
            expect(output).to.contain('skippy dippy doo');
        });
    });
});

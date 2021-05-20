'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

describe('reload', () => {
    let json;

    before(() => {
        execSync('grunt reload --branch=master --mocha=reload', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should generate a json file in the .tmp directory', () => {
        try{
            json = fs.readFileSync(path.join(__dirname, '_fixture/reload/.tmp/content.json'), {encoding: 'utf8'});
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

    it('Generated file should be valid json', () => {
        try{
            json = JSON.parse(json);
        } catch(e){
            expect(e.message).to.not.contain('Unexpected token');
        }
    });

    it('Should correctly process grunt template strings', () => {
        expect(json.attributes.title).to.equal('core');
    });

    it('Should ignore example configs if they exist in the folder above', () => {
        expect(json.content['example-level-1']).to.not.exist;
    });

    it('Should override strings found in high specificity configs', () => {
        expect(json.content['level-0']).to.equal('override');
    });

    it('Should merge strings', () => {
        expect(json.content['level-1']).to.equal('test');
    });

    it('Should merge propertys from example config if the same level config not found in folder above', () => {
        expect(json.content['example-level-2']).to.equal('test');
    });

    it('Should merge arrays via concatanation', () => {
        expect(json.attributes.modernizr).to.deep.equal([
            "flexbox",
	        "csscalc",
            "cssanimations"
        ]);
    });

    it('Should merge objects', () => {
        expect(json.attributes.toggle).to.deep.equal({
            "level-0": "test",
            "level-1": "test"
        });
    });

    it('Should match expected json output', () => {
        expect(json).to.deep.equal(
            JSON.parse(fs.readFileSync(path.join(__dirname, '_expected/content.json'), {encoding: 'utf8'}))
        );
    });
});

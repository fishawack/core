'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const { opts } = require('./_helpers/globals.js');

describe('content-request', () => {
    before(() => {
        execSync('grunt clean:content content-request --mocha=output', opts);
    });
    
    describe('wordpress', () => {
        it('Should save to json files', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/chunk.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/string.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });
    
        it('Should save to txt files', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/chunk.txt')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/media.txt')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/string.txt')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });
    
        it('Should save files to media folder', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/chunk.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/string.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });

        it('Should save files to custom content folder', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/chunk.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/string.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });
    })
});

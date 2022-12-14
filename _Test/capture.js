'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');
const path = require('path');
const glob = require('glob');

describe('capture', () => {
    describe('defaults', () => {
        before(() => {
            execSync('grunt clean:build capture --branch=master --mocha=capture', opts);
        });

        it('Should capture index.html page if no pages property defined', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*_indexhtml_.png'))).to.be.an('array').that.is.not.empty;
        });

        it('Should capture all html routes found in root folder', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*.png')).map(d => path.basename(d))).to.have.members(['0_abouthtml_.png', '1_faqindexhtml_.png', '2_indexhtml_.png']);
        });
    
        it('Should capture chrome if no browser property defined', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/chrome/**/*.png'))).to.be.an('array').that.is.not.empty;
        });
    
        it('Should capture 1080x608 if sizes property not defined', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/1080x608/*.png'))).to.be.an('array').that.is.not.empty;
        });
    });

    describe('options', () => {
        before(() => {
            execSync('grunt clean:build capture --branch=options --mocha=capture', opts);
        });

        it('Should capture only pages defined in config', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*.png'))).to.be.an('array').and.have.lengthOf(1);
        });
    
        it('Should capture only browsers defined in config', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/chrome/**/*.png'))).to.be.an('array').that.is.empty;
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/firefox/**/*.png'))).to.be.an('array').that.is.not.empty;
        });
    
        it('Should capture only sizes defined in config', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/1080x608/*.png'))).to.be.an('array').that.is.empty;
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/1024x768/*.png'))).to.be.an('array').that.is.not.empty;
        });
    });
});
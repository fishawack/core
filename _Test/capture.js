'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');
const path = require('path');
const glob = require('glob');

describe('capture', () => {
    describe('defaults', () => {
        before(() => {
            execSync('grunt clean:build capture --branch=master --mocha=capture', opts);
        });

        it('Should capture index.html page if no pages property defined', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*x*/*_indexhtml_.png'))).to.be.an('array').that.is.not.empty;
        });

        it('Should capture all html routes found in root folder', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*x*/*.png')).map(d => path.basename(d))).to.have.members(['0_abouthtml_.png', '1_faqindexhtml_.png', '2_indexhtml_.png', '3_longhtml_.png']);
        });
    
        it('Should capture chrome if no browser property defined', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/chrome/**/*x*/*.png'))).to.be.an('array').that.is.not.empty;
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
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/chrome/1024x768/*.png')).map(d => path.basename(d))).to.have.members(['0_abouthtml_.png', '1_longhtml_.png']);
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/chrome/375x667/*.png')).map(d => path.basename(d))).to.have.members(['0_abouthtml_.png', '1_longhtml_.png']);
        });
    
        it('Should capture only browsers defined in config', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/firefox/**/*x*/*.png'))).to.be.an('array').that.is.empty;
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/chrome/**/*x*/*.png'))).to.be.an('array').that.is.not.empty;
        });
    
        it('Should capture only sizes defined in config', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/1080x608/*.png'))).to.be.an('array').that.is.empty;
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/1024x768/*.png'))).to.be.an('array').that.is.not.empty;
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/375x667/*.png'))).to.be.an('array').that.is.not.empty;
        });

        it('Should capture entire height of page', () => {
            let height = +execSync('file _Test/_fixture/capture/.tmp/screenshots/chrome/375x667/1_longhtml_.png', {encoding: 'utf8'}).split(',')[1].split('x')[1];
            
            expect(height).to.be.greaterThan(667);
        });
    });

    describe('custom scripts', () => {
        before(() => {
            fs.removeSync(`${__dirname}/_fixture/capture/_Node`); 
            fs.copySync(`${__dirname}/_fixture/capture/_Node-fixture`, `${__dirname}/_fixture/capture/_Node`);
            execSync('grunt clean:build capture --mocha=capture', opts);
        });

        it('Should capture all html routes found in root folder', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*x*/*.png')).map(d => path.basename(d)).map(d => d.split('_')[1])).to.include.members(['abouthtml', 'faqindexhtml', 'indexhtml', 'longhtml']);
        });

        it('Should capture extra pages appended to pages array in custom size script', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*x*/*abouthtml_.png')).map(d => path.basename(d))).to.have.lengthOf(2);
        });

        it('Should capture extra pages specified with screenshot calls in custom page script', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/capture/.tmp/screenshots/**/*x*/*faqindexhtml_.png')).map(d => path.basename(d))).to.have.lengthOf(2);
        });

        it('Should capture the viewable viewport when true passed to screenshot call', () => {
            let height = +execSync('file _Test/_fixture/capture/.tmp/screenshots/chrome/1080x608/5_longhtml_.png', {encoding: 'utf8'}).split(',')[1].split('x')[1];
            
            expect(height).to.be.lessThanOrEqual(608);
        });

        after(() => {
            fs.removeSync(`${__dirname}/_fixture/capture/_Node`); 
        });
    });
});
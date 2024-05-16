'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('content', () => {    
    it('Should pull down assets via lftp', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=lftp', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;
    });

    it('Should pull down assets via ftps', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=ftps', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;
    });

    it('Should clean content folders with no content', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=lftp', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;

        execSync('grunt content:pull --mocha=content --branch=empty', opts);
        
        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/**/*'))).to.be.an('array').that.is.empty;
    });

    it('Should skip cleaning folders without content', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=lftp', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;

        execSync('grunt content:pull --mocha=content --branch=handover', opts);
        
        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/**/*'))).to.be.an('array').that.is.not.empty;
    });

    it('Should clean content folders removed 1', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=double', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;

        execSync('grunt content:pull --mocha=content --branch=single', opts);
        
        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/*')).length).to.equal(1);
    });

    it('Should pull down assets via ssh/scp', () => {
        execSync('grunt clean:content content:pull --mocha=content --branch=ssh', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/content/_Build/content/content-0/**/*'))).to.be.an('array').that.is.not.empty;
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');
const { images, compare } = require('../../_Tasks/compare.js');

describe('compare', () => {
    describe('previous', () => {
        before(() => {
            execSync('grunt clean:coverage compare:previous --mocha=compare --branch=master', opts);
        });

        it('Should write previous comparison to coverage json file', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/compare/coverage/regression.json'))).to.be.an('array').that.is.not.empty;
        });

        it('Should write folder of diff pngs', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/compare/.tmp/difference/**/*.png'))).to.be.an('array').that.is.not.empty;
        });

        it('Should create a pdf file containing the differences from the previous build', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/compare/_Pdfs/*_chrome_compare.pdf'))).to.be.an('array').that.is.not.empty;
        });
    });

    describe('missing', () => {
        let output;
        before(() => {
            output = execSync('grunt clean:coverage compare:previous --mocha=compare --branch=missing', {encoding: 'utf8'});
        });

        it('Should flag missing files from previous run without erroring out', () => {
            expect(output).to.contain(`didn't exist in previous run`);
        });
    });

    describe('unknown', () => {
        before(async () => {
            const base = process.cwd();
            process.chdir(path.join(__dirname, '_fixture/compare'));
            fs.removeSync('.tmp/difference/');
            await compare(['unknown'], [[0, 0]]);
            process.chdir(base);
        });

        it('Should flag unknown browsers as having no images to compare', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/compare/.tmp/difference/**/*.png'))).to.be.an('array').that.is.empty;
        });
    });
    
    describe('browsers', () => {
        before(() => {
            execSync('grunt clean:coverage compare:browsers --mocha=compare --branch=browsers', opts);
        });

        it('Should write browser comparison to coverage json file', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/compare/coverage/comparison-chrome-firefox.json'))).to.be.an('array').that.is.not.empty;
        });
    });

    describe('results', () => {
        let files = [];

        before(() => {
            files.push(
                fs.readFileSync(path.join(__dirname, '_fixture/compare/.tmp/screenshots/chrome/1080x608/0_abouthtml_.png')),
                fs.readFileSync(path.join(__dirname, '_fixture/compare/.tmp/previous/chrome/1080x608/0_abouthtml_.png')),
                fs.readFileSync(path.join(__dirname, '_fixture/compare/.tmp/previous/chrome/1080x608/3_longhtml_.png'))
            );
        });

        it('Should return change of >99 when two completely different files used', async () => {
            expect((await images(files[0], files[1])).result).to.be.greaterThan(99);
        });

        it('Should return change of 0 when the same file compared', async () => {
            expect((await images(files[0], files[0])).result).to.be.equal(0);
        });

        it('Should return change of non zero when different size images used', async () => {
            expect((await images(files[0], files[2])).result).to.be.greaterThan(0);
        });
    });
});

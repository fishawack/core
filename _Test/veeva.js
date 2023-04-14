'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');

describe('veeva', () => {
    before(() => {
        execSync('grunt clean:build capture clean:veeva veeva --branch=package --mocha=package', opts);
    });
    
    it('Should generate a veeva key message zip', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Veeva/*.zip'))).to.be.an('array').to.not.be.empty;
    });

    it('Should generate a veeva key message ctl file', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Veeva/ctlfile/*.ctl'))).to.be.an('array').to.not.be.empty;
    });

    it('Should not generate a shared resource zip when flag is not enabled', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Veeva/veeva_shared_resource.zip'))).to.be.an('array').to.be.empty;
    });

    describe('sharedResource', () => {
        describe('not generated', () => {
            before(() => {
                execSync('grunt clean:veeva veeva --branch=veeva-shared-resource --mocha=package', opts);
            });

            it('Should not generate a shared resource zip when flag enabled but Shared is empty of files', () => {
                expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Veeva/veeva_shared_resource.zip'))).to.be.an('array').to.be.empty;
            });
        });

        describe('generated', () => {
            before(() => {
                execSync('mkdir -p _Test/_fixture/package/_Output/shared');
                execSync('touch _Test/_fixture/package/_Output/shared/shared.css');
                execSync('grunt clean:veeva veeva --branch=veeva-shared-resource --mocha=package', opts);
            });
            it('Should generate a shared resource zip when flag enabled', () => {
                expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Veeva/veeva_shared_resource.zip'))).to.be.an('array').to.not.be.empty;
            });
        
            it('Should contain a dummy thumb.png and index.html inside the veeva_shared_resorce.zip file', () => {
                execSync('unzip _Test/_fixture/package/_Packages/Veeva/veeva_shared_resource.zip -d _Test/_fixture/package/_Packages/Veeva/veeva_shared_resource');
                
                expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Veeva/veeva_shared_resource/thumb.png'))).to.be.an('array').to.not.be.empty;
                expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Veeva/veeva_shared_resource/index.html'))).to.be.an('array').to.not.be.empty;
            });
            after(() => {
                execSync('rm -rf _Test/_fixture/package/_Output/shared');
            });
        });

        describe('countryLanguageSet', () => {
            let csvFileName;
            let csvFileLines;
            let ind;
            before(() => {
                execSync('grunt capture package:veeva --branch=veeva-shared-resource-country --mocha=package', opts);
                csvFileName = fs.readdirSync(path.join(__dirname, '_fixture/package/_Packages/Veeva/')).filter(fn => fn.endsWith('.csv'));
                csvFileLines = fs.readFileSync(path.join(__dirname, '_fixture/package/_Packages/Veeva/' + csvFileName), { encoding: 'utf8' }).split('\n');
                ind = csvFileLines.findIndex(element => element.includes("veeva_shared_resource.zip"));
                console.log(csvFileLines[ind]);
            });
            it('Should find language in csv', () => {
                expect(csvFileLines[ind]).to.contain('English');
            });
        });
    });
});

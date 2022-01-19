'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const { opts } = require('./_helpers/globals.js');

describe('compress', () => {
    before(() => {
        execSync('grunt clean:zip clean:deploy package:deploy compress:deploy --mocha=output', opts);

        execSync('unzip _Test/_fixture/output/_Zips/Deploy.zip -d _Test/_fixture/output/_Zips/Deploy');
    });

    it('Should compress deploy folder to a file called Deploy.zip in the zips directory', () => {
        let message = '';
        try{ fs.readFileSync(path.join(__dirname, '_fixture/output/_Zips/Deploy.zip'), opts); } catch(e){ message = e.message; }
        
        expect(message).to.not.contain('ENOENT');
    });

    it('Should not contain the root folder structure that it was zipped with', () => {
        let message = '';
        try{ fs.readdirSync(path.join(__dirname, '_fixture/output/_Zips/Deploy/_Packages'), opts); } catch(e){ message = e.message; }
        
        expect(message).to.contain('ENOENT');
    });

    it('Any compressed symlinks should remain links and not resolved files when symlinks flag set to true', () => {
        expect((fs.lstatSync('_Test/_fixture/output/_Zips/Deploy/symlink.js')).isSymbolicLink()).to.be.true;
    });

    it('Any compressed symlinks should resolve when symlinks flag set to false', () => {
        execSync('grunt compress:app --mocha=output', opts);

        execSync('unzip _Test/_fixture/output/_Zips/*_App.zip -d _Test/_fixture/output/_Zips/App');

        expect((fs.lstatSync('_Test/_fixture/output/_Zips/App/symlink.js')).isSymbolicLink()).to.be.false;
    });

    it('Symlinks to files outside of the current package should always resolve regardless of symlinks setting', () => {
        expect((fs.lstatSync('_Test/_fixture/output/_Zips/App/ext-symlink.js')).isSymbolicLink()).to.be.false;
        expect((fs.lstatSync('_Test/_fixture/output/_Zips/Deploy/ext-symlink.js')).isSymbolicLink()).to.be.false;
    });

    it('Should compress hidden folders', () => {
        let message = '';
        try{ fs.readFileSync(path.join(__dirname, '_fixture/output/_Zips/Deploy/.hidden'), opts); } catch(e){ message = e.message; }
        
        expect(message).to.not.contain('ENOENT');
    });

    it('Should compress hidden files', () => {
        let message = '';
        try{ fs.readFileSync(path.join(__dirname, '_fixture/output/_Zips/Deploy/.hidden/.env'), opts); } catch(e){ message = e.message; }
        
        expect(message).to.not.contain('ENOENT');
    });

    it('Should not throw error when zipping an empty directory', () => {
        expect(() => execSync('grunt compress:deploy --mocha=reload', opts)).to.not.throw();
    });

    after(() => {
        execSync('rm -rf _Test/_fixture/output/_Zips/Deploy _Test/_fixture/output/_Zips/App');
    });
});

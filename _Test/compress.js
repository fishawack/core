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

    it('Compressed folder should not contain the root folder structure that it was zipped with', () => {
        let message = '';
        try{ fs.readdirSync(path.join(__dirname, '_fixture/output/_Zips/Deploy/_Packages'), opts); } catch(e){ message = e.message; }
        
        expect(message).to.contain('ENOENT');
    });

    it('Any compressed symlinks should remain links and not resolved files when symlinks flag set to true', () => {
        expect((fs.lstatSync('_Test/_fixture/output/_Zips/Deploy/symlink.js')).isSymbolicLink()).to.be.true;
    });

    it('Hidden files and folders should be copied', () => {
        let message = '';
        try{ fs.readFileSync(path.join(__dirname, '_fixture/output/_Zips/Deploy/.env'), opts); } catch(e){ message = e.message; }
        
        expect(message).to.not.contain('ENOENT');
    });
});

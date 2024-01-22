'use strict';

const fs = require('fs');
const glob = require('glob');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts, creds } = require('./_helpers/globals.js');
const lftp = require('../_Tasks/helpers/lftp.js');
const { packages, capitalize } = require('../_Tasks/helpers/misc.js');

describe('package', () => {    
    it('Should not generate an app zip if app flag not preset on branch', () => {
        execSync('grunt clean:zip clean:pdf package --mocha=package', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/package/_Zips/*_App.zip'))).to.be.an('array').that.is.empty;

        expect(fs.existsSync(path.join(__dirname, '_fixture/package/_Zips'))).to.be.false;
        expect(fs.existsSync(path.join(__dirname, '_fixture/package/_Pdfs'))).to.be.false;
    });

    describe('package', () => {    
        before(() => {
            execSync('grunt clean:zip package --mocha=package --branch=package', opts);
        });

        const requested = packages.filter(
            (d) => d.zips?.length || d.zips == null
        );

        for(let i = 0; i < requested.length; i++){
            const { name } = requested[i];

            it(`Should generate an ${name} zip if ${name} flag preset on branch`, () => {
                expect(glob.sync(path.join(__dirname, `_fixture/package/_Zips/*_${capitalize(name)}.zip`))).to.be.an('array').that.is.not.empty;
            });
        }
    });

    after(() => {
        lftp.remove(
            'Shared/FW/Knutsford/Digital/Auto-Package/core-test-suite-package',
            creds.username,
            creds.password,
            creds.host
        );
    });
});

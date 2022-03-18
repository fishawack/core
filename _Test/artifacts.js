'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');
const lftp = require('../_Tasks/helpers/lftp.js');
const os = require('os');
const fs = require('fs');

describe('artifacts', () => {
    const location = path.join(__dirname, "_fixture/artifacts/.tmp/core-test-suite");
    const host = "ftp-fishawack.egnyte.com";
    const creds = JSON.parse(fs.readFileSync(`${os.homedir()}/targets/.ftppass`))[host];

    before(() => {
        execSync('grunt clean:build artifacts --mocha=artifacts', opts);

        lftp.pull(
            location,
            'Shared/FW/Knutsford/Digital/Auto-Package/core-test-suite-artifacts',
            creds.username,
            creds.password,
            host
        );
    });
    
    it('Should transfer files found in _Zips egnyte', () => {
        expect((fs.existsSync(path.join(location, 'core-test-suite.zip')))).to.be.true;
    });

    it('Should transfer files found in _Pdfs to egnyte', () => {
        expect((fs.existsSync(path.join(location, 'core-test-suite.pdf')))).to.be.true;
    });

    after(() => {
        lftp.remove(
            'Shared/FW/Knutsford/Digital/Auto-Package/core-test-suite-artifacts',
            creds.username,
            creds.password,
            host
        );
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');
const fs = require('fs');
const path = require('path');
const location = path.join(__dirname, "_fixture/mail/", ".tmp/mail/log.html");

describe('mail', () => {
    var html = '';

    describe('deploy', () => {
        before(() => {
            execSync('grunt clean:build mail --mocha=mail --branch=deploy', opts);
            html = fs.readFileSync(location, {encoding: 'utf8'});
        });

        it('Should log html email during tests', () => {
            expect((fs.existsSync(location))).to.be.true;
        });

        it('Should contain any deployment url', () => {
            expect(html).to.contain('<strong>Url</strong>:')
        });
    });

    describe('empty', () => {
        before(() => {
            execSync('grunt clean:build mail --mocha=mail --branch=empty', opts);
            html = fs.readFileSync(location, {encoding: 'utf8'});
        });

        it('Should not contain any deployment url', () => {
            expect(html).to.not.contain('<strong>Url</strong>:')
        });

        it('Should not contain any deployment pdf', () => {
            expect(html).to.not.contain('<strong>Pdf</strong>:')
        });

        it('Should not contain any deployment app', () => {
            expect(html).to.not.contain('<strong>App</strong>:')
        });

        it('Should not contain any deployment handover', () => {
            expect(html).to.not.contain('<strong>Handover</strong>:')
        });

        it('Should not contain any deployment veeva', () => {
            expect(html).to.not.contain('<strong>Veeva</strong>:')
        });

        it('Should not contain any deployment cegedim', () => {
            expect(html).to.not.contain('<strong>Cegedim</strong>:')
        });

        it('Should not contain any deployment vablet', () => {
            expect(html).to.not.contain('<strong>Vablet</strong>:')
        });
    });

    describe('package', () => {
        before(() => {
            execSync('grunt clean:build mail --mocha=mail --branch=package', opts);
            html = fs.readFileSync(location, {encoding: 'utf8'});
        });

        it('Should not contain any deployment url', () => {
            expect(html).to.not.contain('<strong>Url</strong>:')
        });

        it('Should contain any deployment pdf', () => {
            expect(html).to.contain('<strong>Pdf</strong>:')
        });

        it('Should contain any deployment app', () => {
            expect(html).to.contain('<strong>App</strong>:')
        });

        it('Should contain any deployment handover', () => {
            expect(html).to.contain('<strong>Handover</strong>:')
        });

        it('Should contain any deployment veeva', () => {
            expect(html).to.contain('<strong>Veeva</strong>:')
        });

        it('Should contain any deployment cegedim', () => {
            expect(html).to.contain('<strong>Cegedim</strong>:')
        });

        it('Should contain any deployment vablet', () => {
            expect(html).to.contain('<strong>Vablet</strong>:')
        });

        it('Should contain links to egnyte folder', () => {
            expect(html).to.contain('<a href="https://fishawack.egnyte.com/app/index.do#storage/files/1/Shared/FW/Knutsford/Digital/Auto-Package/core-test-suite-mail')
        });

        it('Should not contain links to internal server', () => {
            expect(html).to.not.contain('<a href="http://internal.fishawack.staging/Auto-Package/core-test-suite-mail')
        });

        it('Should not contain links to zip files', () => {
            expect(html).to.not.contain('_App.zip"')
        });

        it('Should not contain links to pdf files', () => {
            expect(html).to.not.contain('_chrome.pdf"')
        });
    });

    describe('task', () => {
        it('Should find task declaration', async () => {
            let output = execSync(`node -e "const grunt = require('grunt'); const { jit } = require('./_Tasks/helpers/include.js'); require('jit-grunt')(grunt, jit)(); grunt.task.run('nodemailer').start();"`, {encoding: 'utf8'});

            console.log(output);

            expect(output).to.not.contain('jit-grunt');
        });
    });
});

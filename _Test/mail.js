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
            expect(html).not.to.contain('<strong>Url</strong>:')
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
    });
});

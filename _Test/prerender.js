'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');

describe('prerender', () => {
    it('Should render views to stand alone html files', () => {
        execSync('grunt clean:dist --mocha=prerender', opts);
        fs.copySync(`${__dirname}/_fixture/prerender/_Output-fixture`, `${__dirname}/_fixture/prerender/_Output`);
        execSync('grunt prerender --mocha=prerender', opts);

        expect((fs.existsSync('_Test/_fixture/prerender/_Output/index.html'))).to.be.true;
    });
});
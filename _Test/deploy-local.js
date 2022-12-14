'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('deploy:local', () => {
    it('deploy:local:pre command should create a local file', async () => {
        execSync(`grunt deploy:local:pre --branch=commands --mocha=output`, opts);
        expect(glob.sync(path.join(__dirname, '_fixture/output/core-test-suite-file.txt'))).to.be.an('array').that.is.not.empty;
    });

    it('deploy:local:post command should remove the local file', async () => {
        execSync(`grunt deploy:local:post --branch=commands --mocha=output`, opts);
        expect(glob.sync(path.join(__dirname, '_fixture/output/core-test-suite-file.txt'))).to.be.an('array').that.is.empty;
    });

    it('deploy:local command if missing should skip over task', async () => {
        execSync(`grunt deploy:local:pre --branch=master --mocha=output`, opts);
    });
});

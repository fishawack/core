'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const opts = {encoding: 'utf8', stdio: 'inherit'};

describe('deploy:local', () => {
    it('deploy:local:pre command should create a local file', async () => {
        execSync(`grunt deploy:local:pre --branch=master --mocha=output`, opts);
        expect(glob.sync(path.join(__dirname, '_fixture/output/core-test-suite-file.txt'))).to.be.an('array').that.is.not.empty;
    });

    it('deploy:local:post command should remove the local file', async () => {
        execSync(`grunt deploy:local:post --branch=master --mocha=output`, opts);
        expect(glob.sync(path.join(__dirname, '_fixture/output/core-test-suite-file.txt'))).to.be.an('array').that.is.empty;
    });
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const opts = {encoding: 'utf8', stdio: 'pipe'};

describe('deploy:server', () => {
    before(() => {
        execSync(`grunt takedown --branch=master --mocha=output`, opts);
        execSync(`grunt package:deploy deploy --branch=master --mocha=output`, opts);
    });

    it('deploy:server:pre command should create a local file', async () => {
        execSync(`grunt deploy:server:pre --branch=master --mocha=output`, opts);
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(200);
    });

    it('deploy:server:post command should remove the local file', async () => {
        execSync(`grunt deploy:server:post --branch=master --mocha=output`, opts);
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(404);
    });

    after(() => {
        execSync(`grunt takedown --branch=master --mocha=output`, opts);
    });
});

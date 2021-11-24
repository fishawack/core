'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const opts = {encoding: 'utf8', stdio: 'pipe'};

describe('deploy:server', () => {
    before(() => {
        execSync(`grunt takedown --branch=commands --mocha=output`, opts);
    });

    it('deploy:server:pre command should create a file on the server', async () => {
        execSync(`grunt deploy:server:pre --branch=commands --mocha=output`, opts);
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(200);
    });

    it('deploy:server:post command should remove a file on the server', async () => {
        execSync(`grunt deploy:server:post --branch=commands --mocha=output`, opts);
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(404);
    });

    after(() => {
        execSync(`grunt takedown --branch=commands --mocha=output`, opts);
    });
});

describe('deploy:server subdir', () => {
    before(() => {
        execSync(`grunt takedown --branch=commands-subdir --mocha=output`, opts);
    });

    it('deploy:server:pre command should create a file on the server when run with subdir option', async () => {
        execSync(`grunt deploy:server:pre --branch=commands-subdir --mocha=output`, opts);
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(200);
    });

    it('deploy:server:post command should remove a file on the server when run with subdir option', async () => {
        execSync(`grunt deploy:server:post --branch=commands-subdir --mocha=output`, opts);
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(404);
    });

    after(() => {
        execSync(`grunt takedown --branch=commands-subdir --mocha=output`, opts);
    });
});

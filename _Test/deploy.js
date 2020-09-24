'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');

describe('deploy', () => {
    var branch = '';

    beforeEach(() => {
    });

    it('Should deploy the master target to the server via sftp', async () => {
        branch = 'master';
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.not.equal(200);
        execSync(`grunt package deploy --branch=${branch} --mocha=output`, {encoding: 'utf8', stdio: 'pipe'});
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.be.equal(200);
    });

    it('Should deploy a watertight wrapped site to the server', async () => {
        branch = 'watertight';
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.not.equal(200);
        execSync(`grunt package deploy --branch=${branch} --mocha=output`, {encoding: 'utf8', stdio: 'pipe'});
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/login')).status).to.be.equal(200);
    });

    // it('Should deploy the lftp target to the server via lftp', async () => {
    //     branch = 'lftp';
    //     expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.not.equal(200);
    //     execSync(`grunt package deploy --branch=${branch} --mocha=output`, {encoding: 'utf8', stdio: 'pipe'});
    //     expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.be.equal(200);
    // });

    afterEach(() => {
        execSync(`grunt takedown --branch=${branch} --mocha=output`, {encoding: 'utf8', stdio: 'pipe'}); 
    });
});

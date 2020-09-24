'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');

async function deploy(branch){
    expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.not.equal(200);
    execSync(`grunt package deploy --branch=${branch} --mocha=output`, {encoding: 'utf8', stdio: 'pipe'});
    expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.be.equal(200);
    execSync(`grunt takedown --branch=${branch} --mocha=output`, {encoding: 'utf8', stdio: 'pipe'});
}

describe('deploy', () => {
    it('Should deploy the master target to the server via sftp', () => deploy('master'));
    it('Should deploy a watertight wrapped site to the server', () => deploy('watertight'));
});

'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const opts = {encoding: 'utf8', stdio: 'pipe'};

async function deploy(branch){
    execSync(`grunt takedown --branch=${branch} --mocha=output`, opts);
    expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.not.equal(200);
    execSync(`grunt package:deploy deploy --branch=${branch} --mocha=output`, opts);
    expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.be.equal(200);
    execSync(`grunt takedown --branch=${branch} --mocha=output`, opts);
}

describe('deploy', () => {
    it('Should deploy the master target to the server via scp', () => deploy('master'));
    it('Should deploy a watertight wrapped site to the server', () => deploy('watertight'));
    it('Should deploy the lftp target to the server via lftp', () => deploy('lftp'));
    it('Should deploy the project even with a trailing slash', () => deploy('trailing'));
    it('Should deploy the project as a root folder with a watertight wrapper', () => deploy('root'));
    
    it('Deploying twice in a row should replace the files without hanging', async () => {
        execSync(`grunt deploy --branch=watertight --mocha=output`, opts);
        execSync(`grunt deploy --branch=watertight --mocha=output`, opts);
        execSync(`grunt takedown --branch=watertight --mocha=output`, opts);
    });
});

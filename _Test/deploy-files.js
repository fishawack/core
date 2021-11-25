'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const { opts } = require('./_helpers/globals.js');

async function deploy(branch){
    execSync(`grunt takedown --branch=${branch} --mocha=output`, opts);
    expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.not.equal(200);
    execSync(`grunt package deploy:files --branch=${branch} --mocha=output`, opts); // Package command needed for deploys that need watertight files copying
    expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.be.equal(200);
    execSync(`grunt takedown --branch=${branch} --mocha=output`, opts);
}

describe('deploy:files', () => {
    it('Should deploy the master target to the server via scp', () => deploy('master'));
    it('Should deploy a watertight wrapped site to the server', () => deploy('watertight'));
    it('Should deploy the lftp target to the server via lftp', () => deploy('lftp'));
    it('Should deploy the project even with a trailing slash', () => deploy('trailing'));
    it('Should deploy the project as a root folder with a watertight wrapper', () => deploy('root'));
    
    it('Deploying twice in a row should replace the files without hanging', async () => {
        execSync(`grunt deploy:files --branch=watertight --mocha=output`, opts);
        execSync(`grunt deploy:files --branch=watertight --mocha=output`, opts);
        execSync(`grunt takedown --branch=watertight --mocha=output`, opts);
    });

    it('Deploying to a branch that doesnt exist should skip deployment', () => {
        let output = execSync(`grunt deploy:files --branch=doesnt-exist --mocha=output`, {encoding: 'utf8'});
        expect(output).to.contain('No deployment location configured for doesnt-exist');
    });

    it('Deploying to a location without credentials should throw an error', () => {
        let command = `grunt deploy:files --branch=server-doesnt-exist --mocha=output`;

        try{
            execSync(command, opts);
        } catch(e){
            expect(e.message).to.contain(`Command failed: ${command}`);
        }
    });
});

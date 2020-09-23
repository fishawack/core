'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');

describe('deploy', () => {
    before(() => {
        execSync('grunt deploy --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});

        execSync('grunt tv4 --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});
    });
    
    it('Should deploy the site to the server', async () => {
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.be.equal(200);
    });

    after(() => {
        execSync('grunt sshexec:remove --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'}); 
    });
});

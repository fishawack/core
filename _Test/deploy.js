'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const opts = {encoding: 'utf8', stdio: 'pipe'};

describe('deploy', () => {
    before(() => {
        execSync(`grunt takedown --branch=master --mocha=output`, opts);
        execSync(`grunt package:deploy deploy --branch=master --mocha=output`, opts);
    });

    it('Should do a full deploy of the master target to the server via scp running both local and server pre and post commands', async () => {
        expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy')).status).to.be.equal(200);
    });

    after(() => {
        execSync(`grunt takedown --branch=master --mocha=output`, opts);
    });
});

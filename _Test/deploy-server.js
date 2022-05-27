'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const { opts } = require('./_helpers/globals.js');

describe('deploy:server', () => {
    describe('root', () => {
        before(() => {
            execSync(`grunt takedown --branch=commands --mocha=output`, opts);
        });

        it('pre command should create a file on the server', async () => {
            execSync(`grunt deploy:server:pre --branch=commands --mocha=output`, opts);
            expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(200);
        });

        it('post command should remove a file on the server', async () => {
            execSync(`grunt deploy:server:post --branch=commands --mocha=output`, opts);
            expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(404);
        });

        it('command if missing should skip over task', async () => {
            execSync(`grunt deploy:server:pre --branch=master --mocha=output`, opts);
        });

        // Disabled for now as theres no good way to consistently check an aws eb environment
        // it('deploy:server:pre command should run eb ssh specific command', async () => {
        //     execSync(`grunt deploy:server:pre --branch=aws-eb --mocha=output`, opts);
        // });

        after(() => {
            execSync(`grunt takedown --branch=commands --mocha=output`, opts);
        });
    });

    describe('subdir', () => {
        before(() => {
            execSync(`grunt takedown --branch=commands-subdir --mocha=output`, opts);
        });

        it('pre command should create a file on the server when run with subdir option', async () => {
            execSync(`grunt deploy:server:pre --branch=commands-subdir --mocha=output`, opts);
            expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(200);
        });

        it('post command should remove a file on the server when run with subdir option', async () => {
            execSync(`grunt deploy:server:post --branch=commands-subdir --mocha=output`, opts);
            expect((await fetch('https://demo.fishawack.solutions/core-test-suite-deploy/core-test-suite-file.txt')).status).to.equal(404);
        });

        after(() => {
            execSync(`grunt takedown --branch=commands-subdir --mocha=output`, opts);
        });
    });

    describe('aws-s3', () => {
        it('deploy:server commands should not run for s3 deployments', async () => {
            expect(execSync(`grunt deploy:server:pre --branch=aws-s3 --mocha=output`, {encoding: 'utf8'})).to.contain('not supported');
        });
    });

    describe('aws-cloudfront', () => {
        it('Should invalidate cloudfront distribution', async () => {
            let branch = 'aws-s3-with-cloudfront';
            let url ='https://d3sa39g5u2ao33.cloudfront.net';

            execSync(`grunt package deploy:files --branch=${branch} --mocha=output`, opts);
            execSync(`grunt deploy:server:post --branch=${branch} --mocha=output`, opts);

            let page = await fetch(url);
            let html = await page.text();

            expect(html).to.contain('Hello');

            execSync(`grunt package deploy:files --branch=${branch} --mocha=cache`, opts);

            page = await fetch(url);
            html = await page.text();

            expect(html).to.contain('Hello');

            execSync(`grunt deploy:server:post --branch=${branch} --mocha=cache`, opts);

            page = await fetch(url);
            html = await page.text();

            expect(html).to.contain('Goodbye');

            execSync(`grunt takedown --branch=${branch} --mocha=output`, opts);
        });

        it('Should not invalidate cloudfront when invalid id given', () => expect(() => execSync(`grunt deploy:server:post --branch=aws-s3-with-cloudfront-doesnt-exist --mocha=output`, opts)).to.throw());
    });
});
'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const { opts } = require('./_helpers/globals.js');

async function deploy(branch, url = 'https://core-test-suite-deploy.fishawack.solutions/core-test-suite-deploy'){
    execSync(`grunt takedown --branch=${branch} --mocha=output`, opts);
    expect((await fetch(url)).status).to.not.equal(200);
    execSync(`grunt deploy:server:pre --branch=${branch} --mocha=output`, opts); // Run single pre server command to create the public_html directory on the server
    execSync(`grunt package compress:deploy deploy:files --branch=${branch} --mocha=output`, opts); // Package command needed for deploys that need watertight files copying
    expect((await fetch(url)).status).to.be.equal(200);
    execSync(`grunt takedown --branch=${branch} --mocha=output`, opts);
}

describe('deploy:files', () => {
    it('Should deploy the master target to the server via aws-eb cli', async () => {
        execSync(`rm -rf ${__dirname}/_fixture/output/_Zips/Deploy.zip && mkdir -p ${__dirname}/_fixture/output/_Zips && zip ${__dirname}/_fixture/output/_Zips/Deploy.zip ${__dirname}/_fixture/output/package.json && grunt deploy:files --branch=aws-eb --mocha=output`, opts);
        expect((await fetch('http://coretestsuitedeployelb-env.eba-dpscqytf.us-east-1.elasticbeanstalk.com')).status).to.not.equal(200);
        execSync(`grunt package compress:deploy deploy:files --branch=aws-eb --mocha=output`, opts);
        expect((await fetch('http://coretestsuitedeployelb-env.eba-dpscqytf.us-east-1.elasticbeanstalk.com')).status).to.be.equal(200);
    });
    
    describe('aws-s3', () => {
        it('Should deploy the target to the server via aws-cli', () => deploy('aws-s3', 'http://core-test-suite-deploy.s3-website-us-east-1.amazonaws.com'));
        it('Should deploy the nested target to the server via aws-cli', () => deploy('aws-s3-nested', 'http://core-test-suite-deploy.s3-website-us-east-1.amazonaws.com/nested/'));
        it('Should not deploy to when profile doesnt exist', () => expect(() => execSync(`grunt deploy:files --branch=aws-s3-doesnt-exist --mocha=output`, opts)).to.throw());
        it('Should not deploy to when bucket doesnt exist', () => expect(() => execSync(`grunt deploy:files --branch=aws-s3-bucket-doesnt-exist --mocha=output`, opts)).to.throw());
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

    it('Should deploy the master target to the server via scp', () => deploy('master'));
    it('Should deploy a watertight wrapped site to the server', () => deploy('watertight'));
    it('Should deploy the lftp target to the server via lftp', () => deploy('lftp'));
    it('Should deploy the project even with a trailing slash', () => deploy('trailing'));
    it('Should deploy the project as a root folder with a watertight wrapper', () => deploy('root', 'https://core-test-suite-deploy.fishawack.solutions'));
    
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

    it('Should run all deploy steps when deploy called directly', () => {
        expect(() => execSync(`grunt deploy --branch=doesnt-exist --mocha=output`, {encoding: 'utf8', stdio: 'inherit'})).to.not.throw();
    });
});

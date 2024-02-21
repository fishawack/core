'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');

describe('misc', () => {
    it('Dev project variable should be null', () => {
        expect(require('../../_Tasks/helpers/dev.js')).to.be.null;
    });

    describe('include', () => {
        it('Should use git-branch to fetch current branch', () => {
            const { deployBranch } = require('../../_Tasks/helpers/include.js');
            expect(deployBranch()).to.not.be.undefined;
            expect(deployBranch()).to.not.equal('unknown');
            expect(deployBranch()).to.have.length.greaterThan(0);
            expect(deployBranch()).to.not.contain('\n');
        });

        it('Should use BRANCH env variable as current branch when set', () => {
            process.env.BRANCH = 'hello';

            const { deployBranch } = require('../../_Tasks/helpers/include.js');

            expect(deployBranch()).to.be.equal('hello');

            delete process.env.BRANCH;
        });

        it('Should use BRANCH env variable as current branch when set', () => {
            process.env.CI_COMMIT_REF_NAME = 'goodbye';

            const { deployBranch } = require('../../_Tasks/helpers/include.js');

            expect(deployBranch()).to.be.equal('goodbye');

            delete process.env.CI_COMMIT_REF_NAME;
        });
        
        it('Should use grunt option as current branch when set', () => {
            expect(execSync('grunt mail --mocha=mail --branch=yabbadabba', {encoding: 'utf8'})).to.contain('yabbadabba branch');
        });

        it('Should return true for bootstrap and style-1 loginTypes', () => {
            const { isWatertight } = require('../../_Tasks/helpers/include.js');

            expect(isWatertight('bootstrap')).to.be.true;
            expect(isWatertight('style-1')).to.be.true;
        });

        it('Should return false for null, undefined or other loginTypes', () => {
            const { isWatertight } = require('../../_Tasks/helpers/include.js');

            expect(isWatertight()).to.be.false;
            expect(isWatertight(null)).to.be.false;
            expect(isWatertight(undefined)).to.be.false;
            expect(isWatertight('external')).to.be.false;
        });

        it('Should return true when running core from the core itself', () => {
            const { isCore } = require('../../_Tasks/helpers/include.js');

            expect(isCore()).to.be.true;
        });

        it('Should return false when cwd is running from anywhere other than the core', () => {
            const base = process.cwd();
            process.chdir(path.join(__dirname, '_fixture/bundle'));
            
            const { isCore } = require('../../_Tasks/helpers/include.js');

            expect(isCore()).to.be.false;

            process.chdir(base);
        });

        it('Should return false when cwd is running from folder without a package.json file', () => {
            const base = process.cwd();
            process.chdir(path.join(__dirname, '_helpers'));
            
            const { isCore } = require('../../_Tasks/helpers/include.js');

            expect(isCore()).to.be.false;

            process.chdir(base);
        });

        afterEach(() => {
            delete require.cache[require.resolve('../../_Tasks/helpers/include.js')];
        });
    });
});

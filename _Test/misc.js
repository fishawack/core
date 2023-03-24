'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;

describe('misc', () => {
    it('Dev project variable should be null', () => {
        expect(require('../_Tasks/helpers/dev.js')).to.be.null;
    });

    describe('include', () => {
        it('Should use git-branch to fetch current branch', () => {
            const { deployBranch } = require('../_Tasks/helpers/include.js');
            expect(deployBranch).to.not.be.undefined;
            expect(deployBranch).to.not.equal('unknown');
            expect(deployBranch).to.have.length.greaterThan(0);
            expect(deployBranch).to.not.contain('\n');
        });

        it('Should use BRANCH env variable as current branch when set', () => {
            process.env.BRANCH = 'hello';

            const { deployBranch } = require('../_Tasks/helpers/include.js');

            expect(deployBranch).to.be.equal('hello');

            delete process.env.BRANCH;
        });

        it('Should use BRANCH env variable as current branch when set', () => {
            process.env.CI_COMMIT_REF_NAME = 'goodbye';

            const { deployBranch } = require('../_Tasks/helpers/include.js');

            expect(deployBranch).to.be.equal('goodbye');

            delete process.env.CI_COMMIT_REF_NAME;
        });
        
        it('Should use grunt option as current branch when set', () => {
            expect(execSync('grunt mail --mocha=mail --branch=yabbadabba', {encoding: 'utf8'})).to.contain('yabbadabba branch');
        });

        afterEach(() => {
            delete require.cache[require.resolve('../_Tasks/helpers/include.js')];
        });
    });
});

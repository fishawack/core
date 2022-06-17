'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');
const glob = require('glob');
const path = require('path');

describe('tv4', () => {
    it('Should pass tv4 linting', async () => {
        try{
            glob.sync('*', {cwd: path.join(__dirname, `/_fixture`)}).forEach(fixture => {
                execSync(`grunt tv4 --branch=master --mocha=${fixture}`, opts); 
            });
        } catch(e){
            expect(e.message).to.not.contain('Command failed');
        }
    });
});

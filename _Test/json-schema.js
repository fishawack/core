'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const { opts } = require('./_helpers/globals.js');
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');

describe('json-schema', () => {
    it('Should pass json schema validation', async () => {
        try{
            glob.sync('*', {cwd: path.join(__dirname, `/_fixture`)}).forEach(fixture => {
                if(fs.existsSync(path.join(__dirname, `/_fixture`, fixture, 'package.json'))){
                    execSync(`grunt json-schema --branch=master --mocha=${fixture}`, opts); 
                }
            });
        } catch(e){
            expect(e.message).to.not.contain('Command failed');
        }
    });
});

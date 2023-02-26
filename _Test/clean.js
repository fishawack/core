'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('clean', () => {
    it('Should find task declaration', async () => {
        expect(execSync(`node -e "const grunt = require('grunt'); const { jit } = require('./_Tasks/helpers/include.js'); require('jit-grunt')(grunt, jit)(); grunt.task.run('clean').start();"`, {encoding: 'utf8'})).to.not.contain('jit-grunt');
    });

    describe('process', () => {
        before(() => {
            execSync('grunt clean --branch=master --mocha=bundle', opts);
        });
        
        it('Should remove _Pdfs folder', () => {
            try{
                fs.readdirSync(path.join(__dirname, '_fixture/bundle/_Pdfs'));
            } catch(e){
                expect(e.message).to.contain('ENOENT');
            }
        });
    })
});

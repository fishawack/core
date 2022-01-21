'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('copy', () => {
    before(() => {
        execSync('grunt copy:content copy:assets copy:svg copy:svgasis --branch=master --mocha=bundle', opts);
        execSync('grunt clean:deploy copy:deploy --mocha=output', opts);
    });
    
    it('Should copy assets from media folder', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/media/__fishawack.svg'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

    describe('deploy', () => {
        describe('symlinks', () => {
            describe('local', () => {
                it('Should maintain symlink', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/symlink.js')).isSymbolicLink()).to.be.true;
                });
            });
        
            describe('external', () => {
                it('Should convert symlink', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/ext-symlink.js')).isSymbolicLink()).to.be.false;
                });
            
                it('Should convert nested external symlink', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/ext-ext-symlink.js')).isSymbolicLink()).to.be.false;
                });
            });
            
            describe('local directory', () => {
                it('Should maintain directory symlink', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/dir-symlink')).isSymbolicLink()).to.be.true;
                });
            });
    
            describe('external directory', () => {
                it('Should convert directory symlink', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/ext-dir-symlink')).isSymbolicLink()).to.be.false;
                });

                it('Should maintain nested local symlink', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/local-ext-dir-symlink')).isSymbolicLink()).to.be.true;
                });

                it('Should convert nested external symlink', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/ext-ext-dir-symlink')).isSymbolicLink()).to.be.false;
                });
    
                it('Should copy regular files', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/ext-dir-symlink/index.js'))).to.be.true;
                });
                
                describe('local', () => {
                    it('Should maintain symlink', () => {
                        expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/ext-dir-symlink/dir-ext-symlink.js')).isSymbolicLink()).to.be.true;
                    });
                });
                
                describe('external', () => {
                    it('Should convert symlink', () => {
                        expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/ext-dir-symlink/dir-ext-ext-symlink.js')).isSymbolicLink()).to.be.false;
                    });
                });
            });
        });
    })
});

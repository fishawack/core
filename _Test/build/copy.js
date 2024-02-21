'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('copy', () => {
    before(() => {
        execSync('grunt clean:build svgfit svgmin copy:content copy:assets copy:svg copy:svgasis --branch=master --mocha=bundle', opts);
        execSync('grunt clean:deploy copy:deploy --mocha=output', opts);
    });
    
    it('Should copy assets from media folder', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/media/__fishawack.svg'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

    it('Should copy all svgs with svg-- prefix', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Build/handlebars/generated/embed/svg--svg.svg'), opts);
        } catch(e){
            expect(e.message).to.not.contain('ENOENT');
        }
    });

    it('Should copy all svgs with svg--asis-- prefix', () => {
        try{
            fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Build/handlebars/generated/embed/svg--asis--svg.svg'), opts);
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

                it('Should maintain nested local symlink that comes after its linked directory alphabetically', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/local-ext-dir-symlink')).isSymbolicLink()).to.be.true;
                });

                it('Should convert nested local symlink that comes before its linked directory alphabetically', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/a-local-ext-dir-symlink')).isSymbolicLink()).to.be.false;
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

        describe('custom paths', () => {
            before(() => {
                execSync('grunt clean:deploy copy:deploy --branch=deploy-custom-copy --mocha=output', opts);
            });

            it('Should be no trace of index.html when paths are defined', () => {
                expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/index.html'))).to.be.false;
            });

            describe('directory as string', () => {
                it('Should copy _Node folder', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/_Node'))).to.be.true;
                });

                it('Should copy the contents of the _Node folder', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/_Node/capture.js'))).to.be.true;
                });

                it('Should copy the nested contents of the _Node folder', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/_Node/ext-dir-symlink/index.js'))).to.be.true;
                });
            });

            describe('file as string', () => {
                it('Should copy package.json file', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/package.json'))).to.be.true;
                });

                it('Should copy level-1.json file to root even if found in nested folder', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/level-0.json'))).to.be.true;
                });
            });

            describe('folder as object', () => {
                it('Should copy public folder', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/public'))).to.be.true;
                });

                it('Should copy nested public/ignore folder to root and should be a directory', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/ignore'))).to.be.true;
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/ignore')).isDirectory()).to.be.true;
                });

                it('Should copy contents of the public folder', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/public/index.html'))).to.be.true;
                });

                it('Should ignore the ignore.html file', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/public/ignore.html'))).to.be.false;
                });

                it('Should ignore the ignore folder', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/public/ignore'))).to.be.false;
                });

                it('Should copy the public folder to dest target', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/renamed'))).to.be.true;
                });

                it('Should copy the public folder to dest target to nested location', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/nested/renamed'))).to.be.true;
                });
            });

            describe('file as object', () => {
                it('Should copy ignore.html file', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/ignore.html'))).to.be.true;
                });

                it('Should copy ignore.html file as dest renamed.html target and should be a file', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/renamed.html'))).to.be.true;
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/renamed.html')).isDirectory()).to.be.false;
                });

                it('Should copy ignore.html file as dest renamed.html target to nested location and should be a file', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/nested/renamed.html'))).to.be.true;
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/nested/renamed.html')).isDirectory()).to.be.false;
                });

                it('Should copy ignore.html file as dest renamed.html target to assumed location and should be a file', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/assumed/ignore.html'))).to.be.true;
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/assumed/ignore.html')).isDirectory()).to.be.false;
                });
                
                it('Should copy & rename .gitignore as a file when the file flag is passed', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/.gitignore-renamed'))).to.be.true;
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/.gitignore-renamed')).isDirectory()).to.be.false;
                });
            });

            describe('edge cases', () => {
                it('Should copy folder with a file like name if file path specified in dest', () => {
                    expect((fs.lstatSync('_Test/_fixture/output/_Packages/Deploy/folder.html')).isDirectory()).to.be.true;
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/folder.html/ignore.html'))).to.be.true;
                });
                
                it('Should ignore a file if the include and ignore are for the same file even if dest set', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/about.html'))).to.be.false;
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/test.html'))).to.be.false;
                });

                it('Should ignore a folder if the include and ignore are for the same folder even if dest set', () => {
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/_Build'))).to.be.false;
                    expect((fs.existsSync('_Test/_fixture/output/_Packages/Deploy/test'))).to.be.false;
                });
            });
        })
    });
});

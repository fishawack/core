'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('js', () => {
    describe('features', () => {
        let js;
        before(() => {
            execSync('grunt webpack:dev --branch=js-features --mocha=bundle', opts);
            js = fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/js/script.js'), {encoding: 'utf8'});
        });

        it('Should import es6 javascript file', () => {
            expect(js).contain(`es6 import`);
        });

        it('Should import cjs javascript file', () => {
            expect(js).contain(`common js import`);
        });

        it('Should import es6 json file', () => {
            expect(js).contain(`{\\"json-import-es6\\":true}`);
        });

        it('Should import cjs json file', () => {
            expect(js).contain(`{\\"json-import-cjs\\":true}`);
        });

        it('Should ignore amd module', () => {
            expect(js).contain(`amd ignored`);
        });

        it('Should process env variables found in config', () => {
            expect(js).contain(`skippy dippy doo`);
        });
        
        it('Should process env variables found in .env', () => {
            expect(js).contain(`yabba dabba doo`);
        });

        it('Should override env variables in config with .env values', () => {
            expect(js).contain(`overridey ridey roo`);
        });

        it('Should read in txt files using asset/source', () => {
            expect(js).contain(`this text comes from a txt file`);
        });

        it('Should read in html files using asset/source', () => {
            expect(js).contain(`<h1>this text comes from a html file</h1>`);
        });

        it('Should have compile time flags set', () => {
            expect(js).contain(`__VUE_OPTIONS_API__:\\", true`);
            expect(js).contain(`__VUE_PROD_DEVTOOLS__:\\", false`);
            expect(js).contain(`__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:\\", false`);
        });
    });

    describe('dev', () => {
        before(() => {
            execSync('grunt modernizr webpack:dev concat:dev --branch=master --mocha=bundle', opts);
        });
        
        it('Should generate a javascript bundle', () => {
            expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Output/js/script.js'))).to.be.an('array').that.is.not.empty;
        });

        describe('entrypoints', () => {
            it('Should generate c.js when file with -- prefix is found', () => {
                expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Output/js/c.js'))).to.be.an('array').that.is.not.empty;
            });
        });

        describe('concat', () => {
            it('Should generate crucial.js when files with __ prefix are found', () => {
                expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Output/js/crucial.js'))).to.be.an('array').that.is.not.empty;
            });

            it('Should generate b.js when files with ++ prefix are found', () => {
                expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Output/js/crucial.js'))).to.be.an('array').that.is.not.empty;
            });

            describe('crucial', () => {
                let js;

                before(() => {
                    js = fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/js/crucial.js'), {encoding: 'utf8'});
                });

                it('Should concat __a.js into crucial.js', () => {
                    expect(js).contain('"__a.js"');
                });

                it('Should concat __z.js into crucial.js', () => {
                    expect(js).contain('"__z.js"');
                });

                it('Should concat __modernizr--custom.js into crucial.js', () => {
                    expect(js).contain('modernizr');
                });
            });

            describe('dynamic', () => {
                let js;

                before(() => {
                    js = fs.readFileSync(path.join(__dirname, '_fixture/bundle/_Output/js/b.js'), {encoding: 'utf8'});
                });

                it('Should concat ++b.1.js into b.js', () => {
                    expect(js).contain('"++b.1.js"');
                });

                it('Should concat ++b.1.js into b.js', () => {
                    expect(js).contain('"++b.2.js"');
                });
            });
        });
    });

    describe('dist', () => {
        describe('uglify', () => {
            let js;
    
            before(() => {
                execSync('grunt clean:dist modernizr webpack:dist concat:dist uglify --branch=master --mocha=bundle', opts);
                js = glob.sync(path.join(__dirname, '_fixture/bundle/_Output/js/*.js')).map(d => fs.readFileSync(d, {encoding: 'utf8'}));
            });
    
            it('Should generate a javascript bundle', () => {
                expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Output/js/script.js'))).to.be.an('array').that.is.not.empty;
            });
    
            it('Should minify all output files', () => {
                js.forEach(d => expect(d.split('\n')).to.have.lengthOf(1));
            });
        });
    });
});

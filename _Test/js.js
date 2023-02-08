'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('js', () => {
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

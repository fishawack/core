'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const { opts } = require('./_helpers/globals.js');

describe('vue', () => {
    describe('vue@2', () => {
        let js;

        before(() => {
            execSync(`cd ${path.join(__dirname, '_fixture/vue-2')} && npm ci `, opts);
            execSync(`grunt webpack:dev --mocha=vue-2`, opts);
            js = fs.readFileSync(path.join(__dirname, '_fixture/vue-2/_Output/js/script.js'), {encoding: 'utf8'});
        });
        
        it('Should compile single file components', () => {
            expect(js).to.not.contain('Module parse failed');
        });
    });
});

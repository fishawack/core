'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('handover', () => {
    let json;

    before(() => {
        execSync('grunt clean:handover copy:handover handover --branch=package --mocha=package', opts);

        json = JSON.parse(fs.readFileSync(path.join(__dirname, '_fixture/package/_Packages/Handover/fw.json'), opts));
    });

    it('Should pull in the build files', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Handover/_Build/**/*'))).to.be.an('array').that.is.not.empty;
    });

    it('Should create a config file at the project', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Handover/fw.json'))).to.exist;
    });

    it('Should remove all other config files from known directories', () => {
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Handover/_Build/config'))).that.is.empty;
        expect(glob.sync(path.join(__dirname, '_fixture/package/_Packages/Handover/_Build/content.json'))).that.is.empty;
    });

    it('Should combine all root properties from merged configs', () => {
        expect(json.attributes['old-val-2']).to.equal('foo');
        expect(json.attributes['root-val-2']).to.equal('foo');
    });

    it('Should combine all current branch properties from merged configs at the root', () => {
        expect(json.attributes['old-val-1']).to.equal('foo');
        expect(json.attributes['root-val-1']).to.equal('foo');
    });

    it('Should not contain branch properties from other branches to the current at the root', () => {
        expect(json.attributes['old-val-3']).to.be.undefined;
        expect(json.attributes['root-val-3']).to.be.undefined;
    });
});

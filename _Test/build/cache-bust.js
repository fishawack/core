'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const { opts } = require('./_helpers/globals.js');

describe('cache-bust', () => {
    beforeEach(() => {
        fs.removeSync(`${__dirname}/_fixture/cache-bust/_Output`); 
    });

    it('relative', () => {
        fs.copySync(`${__dirname}/_fixture/cache-bust/_Output-fixture`, `${__dirname}/_fixture/cache-bust/_Output`);
        execSync('grunt cacheBust --mocha=cache-bust', opts);

        expect(glob.sync(path.join(__dirname, '_fixture/cache-bust/_Output/css/style.cache.*.css'))).to.be.not.be.empty;
        expect(glob.sync(path.join(__dirname, '_fixture/cache-bust/_Output/js/script.cache.*.js'))).to.be.not.be.empty;
        
        expect((fs.readFileSync('_Test/build/_fixture/cache-bust/_Output/index.html', {encoding: 'utf8'}))).to.include('css/style.cache.');
        expect((fs.readFileSync('_Test/build/_fixture/cache-bust/_Output/index.html', {encoding: 'utf8'}))).to.include('js/script.cache.');
    });

    it('root', () => {
        fs.copySync(`${__dirname}/_fixture/cache-bust/_Output-fixture-root`, `${__dirname}/_fixture/cache-bust/_Output`);
        execSync('grunt cacheBust --mocha=cache-bust', opts);
        
        expect(glob.sync(path.join(__dirname, '_fixture/cache-bust/_Output/css/style.cache.*.css'))).to.be.not.be.empty;
        expect(glob.sync(path.join(__dirname, '_fixture/cache-bust/_Output/js/script.cache.*.js'))).to.be.not.be.empty;

        expect((fs.readFileSync('_Test/build/_fixture/cache-bust/_Output/index.html', {encoding: 'utf8'}))).to.include('css/style.cache.');
        expect((fs.readFileSync('_Test/build/_fixture/cache-bust/_Output/index.html', {encoding: 'utf8'}))).to.include('js/script.cache.');
    });

    it('subdirectory', () => {
        fs.copySync(`${__dirname}/_fixture/cache-bust/_Output-fixture-subdir`, `${__dirname}/_fixture/cache-bust/_Output/subdirectory/`);
        execSync('grunt cacheBust --mocha=cache-bust --branch=subdirectory', opts);
        
        expect(glob.sync(path.join(__dirname, '_fixture/cache-bust/_Output/subdirectory/css/style.cache.*.css'))).to.be.not.be.empty;
        expect(glob.sync(path.join(__dirname, '_fixture/cache-bust/_Output/subdirectory/js/script.cache.*.js'))).to.be.not.be.empty;

        expect((fs.readFileSync('_Test/build/_fixture/cache-bust/_Output/subdirectory/index.html', {encoding: 'utf8'}))).to.include('/subdirectory/css/style.cache.');
        expect((fs.readFileSync('_Test/build/_fixture/cache-bust/_Output/subdirectory/index.html', {encoding: 'utf8'}))).to.include('/subdirectory/js/script.cache.');
    });
});

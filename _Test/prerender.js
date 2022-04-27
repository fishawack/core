'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');

describe('prerender', () => {
    before(() => {
        execSync('grunt clean:dist --mocha=prerender', opts);
        fs.copySync(`${__dirname}/_fixture/prerender/_Output-fixture`, `${__dirname}/_fixture/prerender/_Output`);
        execSync('grunt prerender --mocha=prerender', opts);
    });

    it('Should render views to stand alone html files', () => {
        expect((fs.existsSync('_Test/_fixture/prerender/_Output/index.html'))).to.be.true;
        expect((fs.existsSync('_Test/_fixture/prerender/_Output/about/index.html'))).to.be.true;
    });

    it('Should set loaded back to loading after prerender', () => {    
        expect((fs.readFileSync('_Test/_fixture/prerender/_Output/index.html', {encoding: 'utf8'}))).to.include('class="loading"').and.not.include('class="loaded"');
    });

    it('Should render out dynamic content', () => {
        expect((fs.readFileSync('_Test/_fixture/prerender/_Output/index.html', {encoding: 'utf8'}))).to.include('<h2>This title is rendered</h2>');
        expect((fs.readFileSync('_Test/_fixture/prerender/_Output/index.html', {encoding: 'utf8'}))).to.include('<h3>Home</h3>');
        expect((fs.readFileSync('_Test/_fixture/prerender/_Output/about/index.html', {encoding: 'utf8'}))).to.include('<h3>About</h3>');
    });
});
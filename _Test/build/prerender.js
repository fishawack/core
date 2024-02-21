'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');

describe('prerender', () => {
    describe('root', () => {
        before(() => {
            fs.removeSync(`${__dirname}/_fixture/prerender/_Output`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Output-fixture`, `${__dirname}/_fixture/prerender/_Output`);

            fs.removeSync(`${__dirname}/_fixture/prerender/_Node`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Node-fixture`, `${__dirname}/_fixture/prerender/_Node`);

            execSync('grunt prerender --mocha=prerender', opts);
        });
    
        it('Should render views to stand alone html files', () => {
            expect((fs.existsSync('_Test/build/_fixture/prerender/_Output/index.html'))).to.be.true;
            expect((fs.existsSync('_Test/build/_fixture/prerender/_Output/about/index.html'))).to.be.true;
        });
    
        it('Should set loaded back to loading after prerender', () => {    
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/index.html', {encoding: 'utf8'}))).to.include('class="loading"').and.not.include('class="loaded"');
        });
    
        it('Should render out dynamic content', () => {
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/index.html', {encoding: 'utf8'}))).to.include('<h2>This title is rendered</h2>');
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/index.html', {encoding: 'utf8'}))).to.include('<h3>Home</h3>');
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/about/index.html', {encoding: 'utf8'}))).to.include('<h3>About</h3>');
        });
    });

    describe('subdirectory', () => {
        before(() => {
            fs.removeSync(`${__dirname}/_fixture/prerender/_Output`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Output-fixture-subdir`, `${__dirname}/_fixture/prerender/_Output/subdirectory`);

            fs.removeSync(`${__dirname}/_fixture/prerender/_Node`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Node-fixture`, `${__dirname}/_fixture/prerender/_Node`);

            execSync('grunt prerender --mocha=prerender --branch=subdirectory', opts);
        });
    
        it('Should render views to stand alone html files', () => {
            expect((fs.existsSync('_Test/build/_fixture/prerender/_Output/subdirectory/index.html'))).to.be.true;
            expect((fs.existsSync('_Test/build/_fixture/prerender/_Output/subdirectory/about/index.html'))).to.be.true;
        });
    
        it('Should set loaded back to loading after prerender', () => {    
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/subdirectory/index.html', {encoding: 'utf8'}))).to.include('class="loading"').and.not.include('class="loaded"');
        });
    
        it('Should render out dynamic content', () => {
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/subdirectory/index.html', {encoding: 'utf8'}))).to.include('<h2>This title is rendered</h2>');
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/subdirectory/index.html', {encoding: 'utf8'}))).to.include('<h3>Home</h3>');
            expect((fs.readFileSync('_Test/build/_fixture/prerender/_Output/subdirectory/about/index.html', {encoding: 'utf8'}))).to.include('<h3>About</h3>');
        });
    });

    describe('performance', () => {
        it('Should render views in batches so node doesn\'t eat all the RAM', () => {
            fs.removeSync(`${__dirname}/_fixture/prerender/_Output`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Output-fixture`, `${__dirname}/_fixture/prerender/_Output`);

            fs.removeSync(`${__dirname}/_fixture/prerender/_Node`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Node-fixture`, `${__dirname}/_fixture/prerender/_Node`);

            const output = execSync('grunt prerender --mocha=prerender', {encoding: 'utf8'});
            expect(output).to.contain('New Batch of 2: 0 remaining');
        });

        it('Should render large amounts of views in batches', () => {
            fs.removeSync(`${__dirname}/_fixture/prerender/_Output`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Output-fixture`, `${__dirname}/_fixture/prerender/_Output`);

            fs.removeSync(`${__dirname}/_fixture/prerender/_Node`); 
            fs.copySync(`${__dirname}/_fixture/prerender/_Node-fixture-largedataset`, `${__dirname}/_fixture/prerender/_Node`);

            expect(() => execSync('grunt prerender --mocha=prerender', opts)).to.not.throw();
        });
    });
});
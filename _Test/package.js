'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');

// describe('pdf', () => {
//     let json;

//     before(() => {
//         // execSync('grunt pdf --branch=master --mocha', {encoding: 'utf8', stdio: 'pipe'});
//     });
    
//     it('Should generate a json file in the .tmp directory', () => {
//         expect(true).to.be.equal(true);
//     });
// });

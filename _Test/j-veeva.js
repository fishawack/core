'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const grunt = require('grunt');
const execSync = require('child_process').execSync;
const path = require('path');
const glob = require('glob');

// describe('veeva', () => {
//     before(() => {
//         execSync('grunt veeva --branch=master --mocha=bundle', {encoding: 'utf8', stdio: 'pipe'});
//     });
    
//     it('Should generate a veeva key message zip', () => {
//         expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Packages/Veeva/*.zip'))).to.have.length;
//     });

//     it('Should generate a veeva key message ctl file', () => {
//         expect(glob.sync(path.join(__dirname, '_fixture/bundle/_Packages/Veeva/ctlfile/*.ctl'))).to.have.length;
//     });
// });

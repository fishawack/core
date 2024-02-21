'use strict';

const expect = require('chai').expect;
const exec = require('child_process').exec;
const { opts } = require('./_helpers/globals.js');
var kill = require('tree-kill');

describe('default', () => {
    it('Should run a development build', async () => {
        let watchTask;
        let output = await new Promise((resolve, reject) => {
            watchTask = exec('grunt --mocha=bundle');

            let output = '';
            watchTask.stdout.on('data', (data) => {
                output += data;

                if(data.includes('Waiting...')){
                    resolve(output);
                }
                
                if(data.includes('Aborted due to warnings')){
                    reject(data);
                }
            });
        });
        kill(watchTask.pid);
        expect(output).to.include('Running "watch" task');
    });
});

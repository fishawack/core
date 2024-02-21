'use strict';

const expect = require('chai').expect;
const exec = require('child_process').exec;
const { opts } = require('./_helpers/globals.js');
var kill = require('tree-kill');

describe('watch', () => {
    it('Should run watch', async () => {
        let watchTask;
        let output = await new Promise((resolve, reject) => {
            watchTask = exec('grunt watch --mocha=output', reject);

            let output = '';
            watchTask.stdout.on('data', (data) => {
                output += data;
                if(data.includes('Waiting...')){
                    resolve(output);
                }
            });

            watchTask.stderr.on('data', (data) => {
                reject(data);
            });
        });
        kill(watchTask.pid);
        expect(output).to.include('Running "watch" task');
    });
});

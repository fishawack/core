'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');

function cmd(command, output) {   
    const commandOutput = execSync(`cd ${path.join(__dirname, '_fixture/githooks/')} && ${command}`, (output ? {encoding:'utf8'} : opts));
    if (output) {
        return commandOutput;
    }
}

function createFiles(files) {
    files.forEach(file => {
        fs.outputFileSync(path.join(__dirname, `_fixture/githooks/${file}`), '{ "key": "value" }');
    });
}

function deleteFiles(files) {
    files.forEach(file => {
        fs.removeSync(path.join(__dirname, `_fixture/githooks/${file}`));
    });
}

describe('githooks', () => {

    before(() => {
        cmd(`git init`);
        cmd(`git config user.email "you@example.com" && git config user.name "Your Name"`);
        cmd(`git config core.hooksPath ${path.join(__dirname, '../.githooks')}`, true);
    });
    
    it('should pass pre-commit hook if only level-0 file is committed', () => {
        deleteFiles(['level-0.json']);
        createFiles(['level-0.json']);

        cmd(`git add level-0.json`);
        cmd(`git commit -m "test"`);
        expect(cmd(`git log --oneline`, true)).to.contain('test');

        deleteFiles(['level-0.json']);
    });

    it('should not pass pre-commit hook if level-0 and level-1 files are committed', () => {
        deleteFiles(['level-0.json', 'level-1.json']);
        createFiles(['level-0.json', 'level-1.json']);

        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.throw();

        deleteFiles(['level-0.json', 'level-1.json']);
    });

    after(() => {
        // remove the .git folder from the fixture folder (so it doesn't get committed)
        execSync(`rm -rf ${path.join(__dirname, '_fixture/githooks/.git')}`, opts);
    });
});
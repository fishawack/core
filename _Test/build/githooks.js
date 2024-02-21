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
    beforeEach(() => {
        cmd(`git init`);
        cmd(`git config user.email "you@example.com" && git config user.name "Your Name"`);
        cmd(`git config core.hooksPath ${path.join(__dirname, '../.githooks')}`, true);
        cmd(`git config safe.directory '*'`);
        cmd(`git checkout -b 'development'`);
        deleteFiles(['_Build']);
    });

    it('should  pass pre-commit hook when pushing to non-master brances', () => {
        createFiles(['_Build/config/level-0.json']);
        cmd(`git checkout -b 'development'`);
        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.not.throw();
        createFiles(['_Build/config/level-1.json']);
        cmd(`git checkout -b 'staging'`);
        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.not.throw();
        createFiles(['_Build/config/level-2.json']);
        cmd(`git checkout -b 'master-alt'`);
        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.not.throw();
    });
    
    it('should not pass pre-commit hook when pushing to master', () => {
        createFiles(['_Build/config/level-0.json']);
        cmd(`git checkout -b 'master'`);
        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.throw();
    });
    
    it('should pass pre-commit hook if only level-0 file is committed', () => {
        createFiles(['_Build/config/level-0.json']);
        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.not.throw();
    });

    it('should not pass pre-commit hook if level-0 and level-1 files are committed', () => {
        createFiles([
            '_Build/config/level-0.json', 
            '_Build/config/level-1.json'
        ]);
        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.throw();
    });

    it('should pass pre-commit hook if only current-level files are committed', () => {
        createFiles([
            '_Build/config/level-0.json'
        ]);
        expect(() => cmd(`git add . && git commit -m "commit level 0 files"`)).to.not.throw();
        createFiles([
            '_Build/config/level-1.json'
        ]);
        expect(() => cmd(`git add . && git commit -m "commit level 1 files"`)).to.not.throw();
        createFiles([
            '_Build/config/level-2.json', 
            '_Build/sass/level-2/_general.scss',
            '_Build/sequences/aSequence/content.json',
            '_Build/sequences/aSequence/style.scss'
        ]);
        expect(() => cmd(`git add . && git commit -m "commit level 2 files"`)).to.not.throw();
    });

    it('should not pass pre-commit hook if low-level files are committed with current-level files', () => {
        createFiles([
            '_Build/config/level-1.json', 
            '_Build/sass/level-2/_general.scss',
            '_Build/sequences/aSequence/content.json',
            '_Build/sequences/aSequence/style.scss'
        ]);
        cmd(`git add .`);
        expect(() => cmd(`git commit -m "test"`)).to.throw();
    });

    afterEach(() => {
        // remove the .git folder from the fixture folder (so it doesn't get committed)
        execSync(`rm -rf ${path.join(__dirname, '_fixture/githooks/.git')}`, opts);
        deleteFiles(['_Build']);
    });
});
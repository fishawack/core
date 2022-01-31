'use strict';

const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs-extra');
const { opts } = require('./_helpers/globals.js');

const { download, rewrite } = require('../_Tasks/helpers/requests.js');

describe('content-request', () => {
    before(() => {
        execSync('grunt clean:content content:request --mocha=output', opts);
    });

    // it('Should pull media assets from json files', async () => {
    //     await download({
    //         path: `https://stream-api.fishawack.solutions`,
    //         saveTo: `_Test/_fixture/output/_Build/content/content-2/`,
    //         ext: 'json',
    //         bundle: '',
    //         find: `^https.*/wp-content/uploads`
    //     });

    //     await download({
    //         path: `http://172.16.8.21:8887`,
    //         saveTo: `_Test/_fixture/output/_Build/content/content-8/`,
    //         ext: 'json',
    //         bundle: '',
    //         find: `^/images/image-library`
    //     });
    // });

    // it('Should rewrite json files to use local paths', () => {
    //     rewrite({
    //         path: `https://stream-api.fishawack.solutions`,
    //         saveTo: `_Test/_fixture/output/_Build/content/content-2/`,
    //         ext: 'json',
    //         bundle: '',
    //         find: `^https.*/wp-content/uploads`
    //     });
    // });
    
    describe('wordpress', () => {
        it('Should save to json files', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/chunk.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/string.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-2/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });
    
        it('Should save to txt files', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/chunk.txt')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/media.txt')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/string.txt')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-3/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });
    
        it('Should save files to media folder', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/chunk.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/string.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-4/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });

        it('Should save files to custom content folder', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/chunk.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/string.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/custom/media/2020/04/Screenshot-2020-04-02-at-13.17.35.png')).isFile()).to.be.true;
        });

        it('Should save to json files with trailing slash on url', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-6/posts.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-6/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-6/media/2022/01/922285.jpg')).isFile()).to.be.true;
        });

        it('Should save to json files with missing slashes on api', () => {
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-7/posts.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-7/media.json')).isFile()).to.be.true;
            expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-7/media/2022/01/922285.jpg')).isFile()).to.be.true;
        });

        it('Should rewrite media assets to local paths', () => {
            expect(fs.readJSONSync('_Test/_fixture/output/_Build/content/content-2/media.json')[0].source_url).to.include('media/content');
        });
    });

    describe('craft', () => {
        describe('sonar', () => {
            it('Should save to json files', () => {
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/statements.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/search.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/sitemap.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/images.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/imagelibrary.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/coremessages.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/comparisontables.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/resources.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/terminologyguide.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/tags.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/resourcetags.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-8/media/_4000x3000_fit_center-center_90/381/Unifocal_GA_1-M12_FAF.jpg')).isFile()).to.be.true;
            });

            it('Should rewrite media assets to local paths', () => {                
                expect(fs.readJSONSync('_Test/_fixture/output/_Build/content/content-8/coremessages.json')[0].images.thumbnail.url).to.include('media/content');
                expect(fs.readJSONSync('_Test/_fixture/output/_Build/content/content-8/images.json')[0].url).to.include('media/content');
            });
        });

        describe('neptune', () => {
            it('Should save to json files', () => {
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/publications.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/congresses.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/journals.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/studies.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/categories.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/tags.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/doc-types.json')).isFile()).to.be.true;
                expect((fs.lstatSync('_Test/_fixture/output/_Build/content/content-9/global.json')).isFile()).to.be.true;
            });

            it('Should not try and save media files when find set to null', () => {
                expect((fs.existsSync('_Test/_fixture/output/_Build/content/content-9/media'))).to.be.false;
            });
        });
    });
});

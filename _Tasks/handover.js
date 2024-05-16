const { deployBranch } = require('./helpers/include');

module.exports = (grunt) => {
    grunt.registerTask('package:handover', ['clean:handover', 'copy:handover', 'handover']);

    grunt.registerTask('handover', () => {
        const fs = require('fs-extra');
        const glob = require('glob');

        var location = './_Packages/Handover';

        fs.writeFileSync(`${location}/.gitignore`, fs.readFileSync(`${location}/.gitignore`, 'utf8').replace('\n_Build/content', ''));

        var baseConfig = {};
        
        glob.sync(`${location}/${config.src}/config/**/*.json`)
            .forEach(d => {
                _.mergeWith(baseConfig,fs.readJSONSync(d));
            });
        [
            'deploy',
            'content',
            'phonegap',
            'veeva',
            'cegedim',
            'vablet',
            'email',
            'targets',
            'env'
        ].forEach(d => delete baseConfig.attributes[d]);

        fs.writeFileSync(`${location}/fw.json`,JSON.stringify(baseConfig,null,4));
        fs.rmSync(`${location}/${config.src}/config/`, { recursive: true, force: true });

        let pkg = fs.readJSONSync(`${location}/package.json`);
        [
            'deploy',
            'deploy-s'
        ].forEach(d => pkg.scripts && delete pkg.scripts[d]);

        fs.writeFileSync(`${location}/package.json`, JSON.stringify(pkg, null, 4));
    });
};
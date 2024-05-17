const { deployBranch } = require('./helpers/include');

module.exports = (grunt) => {
    grunt.registerTask('package:handover', ['clean:handover', 'copy:handover', 'handover']);

    grunt.registerTask('handover', () => {
        const fs = require('fs-extra');
        const glob = require('glob');

        let location = './_Packages/Handover';

        fs.writeFileSync(`${location}/.gitignore`, fs.readFileSync(`${location}/.gitignore`, 'utf8').replace('\n_Build/content', ''));

        let baseConfig = fs.readJSONSync(contentPath);
        
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

        fs.rmSync(`${location}/fw.json`, { recursive: true, force: true });
        fs.rmSync(`${location}/${config.src}/config/`, { recursive: true, force: true });
        fs.rmSync(`${location}/${config.src}/content.json`, { recursive: true, force: true });

        fs.writeFileSync(`${location}/fw.json`,JSON.stringify(baseConfig,null,4));

        let pkg = fs.readJSONSync(`${location}/package.json`);
        [
            'deploy',
            'deploy-s'
        ].forEach(d => pkg.scripts && delete pkg.scripts[d]);

        fs.writeFileSync(`${location}/package.json`, JSON.stringify(pkg, null, 4));
    });
};
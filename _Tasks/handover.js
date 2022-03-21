module.exports = (grunt) => {
    grunt.registerTask('package:handover', ['clean:handover', 'copy:handover', 'handover']);

    grunt.registerTask('handover', () => {
        const fs = require('fs-extra');
        const glob = require('glob');

        var location = './_Packages/Handover';

        fs.writeFileSync(`${location}/.gitignore`, fs.readFileSync(`${location}/.gitignore`, 'utf8').replace('\n_Build/content', ''));

        glob.sync(`${location}/${config.src}/config/**/*.json`)
            .forEach(d => {
                var config = fs.readJSONSync(d);
                [
                    'deploy',
                    'content',
                    'phonegap',
                    'veeva',
                    'cegedim',
                    'vablet',
                    'email'
                ].forEach(d => delete config.attributes[d]);

                fs.writeFileSync(d, JSON.stringify(config, null, 4));
            });

        let pkg = fs.readJSONSync(`${location}/package.json`);
        [
            'deploy',
            'deploy-s',
            'setup',
            'content'
        ].forEach(d => pkg.scripts && delete pkg.scripts[d]);

        fs.writeFileSync(`${location}/package.json`, JSON.stringify(pkg, null, 4));
    });
};
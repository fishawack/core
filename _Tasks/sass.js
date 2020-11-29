module.exports = (grunt) => {
    var execSync = require('child_process').execSync;
    var glob = require('glob');
    var path = require('path');

    grunt.registerTask('sass', () => {
        execSync(`sass --update --no-source-map --style=expanded \
            --load-path=node_modules/breakpoint-sass/stylesheets \
            --load-path=node_modules/normalize-scss/sass \
            --load-path=node_modules/@fishawack/lab-ui/_Build/sass \
            --load-path=node_modules \
            ${glob.sync('_Build/sass/**/*.scss', { "ignore": '**/_*.scss' })
                .map(d => `${d}:.tmp/css/${path.basename(d, path.extname(d))}.css`).join(' ')
            }
        `, {encoding: 'utf8', stdio: 'inherit'});
    });
};
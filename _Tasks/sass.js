module.exports = (grunt) => {
    var execSync = require('child_process').execSync;
    var path = require('path');

    grunt.registerMultiTask('sass', function() {
        var targets = this.files.filter(d => path.basename(d.src[0]).charAt(0) !== '_' && grunt.file.exists(d.src[0]))
            .map(d => `${d.src[0]}:${d.orig.dest}${path.basename(d.dest, path.extname(d.dest))}.css`).join(' ');

        if(targets.length){
            execSync(`sass --update --no-source-map --style=expanded \
                --load-path=node_modules/breakpoint-sass/stylesheets \
                --load-path=node_modules/normalize-scss/sass \
                --load-path=node_modules/@fishawack/lab-ui/_Build/sass \
                --load-path=node_modules \
                ${targets}
            `, {encoding: 'utf8', stdio: 'inherit'});
        } else {
            grunt.log.warn('No sass files found');
        }
    });
};
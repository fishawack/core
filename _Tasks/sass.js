module.exports = (grunt) => {
    var execSync = require('child_process').execSync;
    var path = require('path');

    grunt.registerMultiTask('sass', function(asdf) {
        var options = this.options();

        var targets = this.files.filter(d => grunt.file.exists(d.src[0]))
            .map(d => `${d.src[0]}:${d.dest}`);

        if(targets.length){
            execSync(`sass --update \
                --${options.sourceMap === false ? 'no-' : ''}source-map \
                --style=${options.outputStyle} \
                ${options.includePaths.map(d => `--load-path=${d}`).join(' ')} \
                ${targets.join(' ')}
            `, {encoding: 'utf8', stdio: 'inherit'});
        } else {
            grunt.log.warn('No sass files found');
        }
    });
};
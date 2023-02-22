module.exports = grunt => {
    grunt.registerMultiTask('fontello_svg', function() {
        let options = this.options();

        require('child_process').execSync(`fontello-svg --config="${this.data.config}" --out="${this.data.dest}"${options.skip ? '' : ' --no-skip'}${options.css ? '' : ' --no-css'}${options.fileFormat ? ` --file-format="${options.fileFormat}"` : ''}`, {encoding: 'utf8', stdio: 'inherit'});
    });
};
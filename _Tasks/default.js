module.exports = grunt => {
    grunt.registerTask('default', ['clean:cache', 'modernizr', 'json-schema', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:shared', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dev', 'concat:dev', 'compile-handlebars', 'htmlmin', 'sass', 'clean:build', 'browserSync', 'watch']);
};
module.exports = grunt => {
    grunt.registerTask('default', ['clean:cache', 'jshint', 'modernizr', 'tv4', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dev', 'concat:dev', 'compile-handlebars', 'htmlmin', 'compile-vue', 'sass', 'postcss:dev', 'concat:sass', 'clean:build', 'browserSync', 'watch']);
};
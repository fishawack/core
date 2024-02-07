module.exports = grunt => {
    grunt.registerTask('dist', module.exports.tasks.dist);
};

module.exports.tasks = {
    dist: ['clean:cache', 'clean:dist', 'modernizr', 'json-schema', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:shared', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dist', 'concat:dist', 'uglify:dist', 'compile-handlebars', 'htmlmin', 'sass', 'cacheBust', 'clean:build', 'prerender']
}
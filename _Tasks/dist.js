module.exports = grunt => {
    var arr = ['clean:cache', 'clean:dist', 'modernizr', 'json-schema', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:shared', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dist', 'concat:dist', 'uglify:dist', 'compile-handlebars', 'htmlmin', 'sass', 'cacheBust', 'imagemin', 'clean:build'];

    /* PreRender */
    if(contentJson.attributes.prerender){
        arr.push('prerender');
    }
    
    grunt.registerTask('dist', arr);
};
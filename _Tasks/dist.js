module.exports = grunt => {
    var arr = ['clean:dist', 'jshint', 'modernizr', 'tv4', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:shared', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dist', 'concat:dist', 'uglify:dist', 'compile-handlebars', 'htmlmin', 'compile-vue', 'sass', 'cacheBust', 'imagemin', 'clean:build'];

    /* PreRender */
    if(contentJson.attributes.prerender){
        arr.push('prerender');
    }
    
    grunt.registerTask('dist', arr);
};
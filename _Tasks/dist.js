module.exports = grunt => {
    var arr = ['clean:dist', 'jshint', 'modernizr', 'tv4', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dist', 'concat:dist', 'uglify:dist', 'compile-handlebars', 'htmlmin', 'compile-vue', 'sass', 'postcss:dist', 'cacheBust', 'imagemin', 'clean:build'];

    /* PreRender */
    if(contentJson.attributes.prerender){
        arr.push('prerender');
    }
    
    grunt.registerTask('dist', arr);
};
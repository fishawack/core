module.exports = function(grunt) {

    require('./_Tasks/helpers/include.js')(grunt);

    initConfig();

    if(devProject){
        require('time-grunt')(grunt);
    }

    grunt.util._.extend(config, loadConfig('./_Tasks/options/'));

    grunt.initConfig(config);

    // CONCAT/UGLIFY DYNAMIC
    grunt.file.expand({cwd: '_Build/js/', flatten: true}, '**/++*.js').forEach(function(d){
        var file = d.slice(d.indexOf('++') + 2);
        var group = file.slice(0, file.indexOf('.'));

        config.concat.dev.files[0][config.root + '/js/' + group + '.js'] = '_Build/js/**/++' + group + '*.js';
        config.concat.dist.files[0]['.tmp/js/' + group + '.js'] = '_Build/js/**/++' + group + '*.js';
    });
    
    // Load all grunt npm tasks with the prefix 'grunt-'
    require('jit-grunt')(grunt, {
        sshexec: 'grunt-ssh',
        sftp: 'grunt-ssh',
        postcss: '@lodder/grunt-postcss'
    })({
        cwd: configPath
    });

    // Load all custom tasks found in _Tasks
    grunt.loadTasks(configPath + '_Tasks');

    watchSmokeTests();

    // Setup custom template handlebar code
    templateCustom();        

    grunt.registerTask('default', ['clean:cache', 'env:dev', 'karma:unit:start', 'jshint', 'modernizr', 'tv4', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dev', 'concat:dev', 'compile-handlebars', 'htmlmin', 'compile-vue', 'sass', 'postcss:dev', 'clean:build', 'browserSync', 'watch']);

    var arr = ['env:dist', 'clean:dist', 'jshint', 'modernizr', 'tv4', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:assets', 'copy:svg', 'copy:svgasis', 'webpack:dist', 'concat:dist', 'uglify:dist', 'compile-handlebars', 'htmlmin', 'compile-vue', 'sass', 'postcss:dist', 'cacheBust', 'imagemin', 'clean:build'];

    /* PreRender */
    if(contentJson.attributes.prerender || deployEnv.prerender){
        arr.push('prerender');
    }
    
    grunt.registerTask('dist', arr);

    grunt.registerTask('validate', ['jshint', 'tv4', 'connect', 'casperjs:local', 'karma:continuous', 'badges', 'coverage']);
};

function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: configPath + path}).forEach(function(option) {
        key = option.replace(/\.js$/,'');
        object[key] = require(path + option);
    });

    return object;
}
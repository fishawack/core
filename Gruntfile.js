module.exports = function(grunt) {

    grunt.file.setBase('../../');

    require('./_Tasks/helpers/include.js')(grunt);

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        //CONTENT IN CONIFG SO IT CAN BE PASSED TO GRUNT TASKS
        contentJson: contentJson,
        //ROOT OF SITE WHERE FILES
        root: contentJson.attributes.root || '_Output',
        targets: {}
    };

    loadTargets(config);

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
        sftp: 'grunt-ssh'
    })({
        cwd: 'node_modules/config-grunt/'
    });

    // Load all custom tasks found in _Tasks
    grunt.loadTasks('node_modules/config-grunt/_Tasks');

    watchSmokeTests();

    // Setup custom postcss code / can't load from external files from plugin
    postcssCustom();

    grunt.registerTask('default', ['env:dev', 'karma:unit:start', 'badges', 'jshint', 'modernizr', 'tv4', 'browserify:dev', 'concat:dev', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:assets', 'copy:svg', 'copy:svgasis', 'compile-handlebars:dev', 'htmlmin', 'sass:dev', 'postcss:all', 'clean:build', 'browserSync', 'connect', 'watch']);
    
    grunt.registerTask('dist', ['env:stage', 'clean:dist', 'badges', 'jshint', 'modernizr', 'tv4', 'browserify:dist', 'concat:dist', 'uglify:dist', 'fontello_svg', 'svgfit', 'svgmin', 'svg_sprite', 'copy:content', 'copy:assets', 'copy:svg', 'copy:svgasis', 'compile-handlebars:dist', 'htmlmin', 'sass:dist', 'postcss:all', 'imagemin', 'clean:build']);

    grunt.registerTask('validate', ['jshint', 'tv4', 'connect', 'casperjs:local', 'karma:continuous', 'coverage']);
};

function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: 'node_modules/config-grunt/' + path}).forEach(function(option) {
        key = option.replace(/\.js$/,'');
        object[key] = require(path + option);
    });

    return object;
}
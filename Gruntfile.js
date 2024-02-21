module.exports = grunt => {
    // Pull in include
    require('./_Tasks/helpers/include.js')(grunt);

    if(devProject) {
        require('time-grunt')(grunt);
    }

    initConfig();

    // Pull in include from build folder
    try { require(`${taskDir}/_Tasks/helpers/include.js`)(grunt); } catch(e) { }

    // Load options
    grunt.util._.extend(config, loadConfig(`${coreDir}_Tasks/options/`));

    // Load otions from build folder
    grunt.util._.extend(config, loadConfig(`${taskDir}/_Tasks/options/`));

    grunt.initConfig(config);

    // CONCAT/UGLIFY DYNAMIC
    grunt.file.expand({ cwd: `${config.src}/js/`, flatten: true }, '**/++*.js').forEach(function (d) {
        var file = d.slice(d.indexOf('++') + 2);
        var group = file.slice(0, file.indexOf('.'));

        config.concat.dev.files[0][config.root + '/js/' + group + '.js'] = `${config.src}/js/**/++${group}*.js`;
        config.concat.dist.files[0]['.tmp/js/' + group + '.js'] = `${config.src}/js/**/++${group}*.js`;
    });

    // Load all grunt npm tasks with the prefix 'grunt-'
    require('jit-grunt')(grunt, jit)({
        cwd: coreDir
    });

    // Load all custom tasks found in _Tasks
    grunt.loadTasks(coreDir + '_Tasks');

    // Load any custom tasks found in the build folder
    grunt.loadTasks(taskDir + '/_Tasks');

    // Setup custom template handlebar code
    templateCustom();
};

function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', { cwd: path }).forEach(function (option) {
        key = option.replace(/\.js$/, '');
        object[key] = require(require('path').resolve(path, option));
    });

    return object;
}
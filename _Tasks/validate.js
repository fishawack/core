module.exports = grunt => { 
    grunt.registerTask('validate', ['jshint', 'json-schema', 'karma:continuous', 'connect', 'webdriver:ui', 'coverage']);
};
module.exports = grunt => { 
    grunt.registerTask('validate', ['json-schema', 'karma:continuous', 'connect', 'webdriver:ui', 'coverage']);
};
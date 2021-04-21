module.exports = grunt => { 
    grunt.registerTask('validate', ['jshint', 'tv4', 'karma:continuous', 'connect', 'webdriver:ui', 'badges', 'coverage']);
};
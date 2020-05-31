module.exports = grunt => { 
    grunt.registerTask('validate', ['jshint', 'tv4', 'connect', 'casperjs:local', 'karma:continuous', 'badges', 'coverage']);
};
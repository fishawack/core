module.exports = grunt => { 
    grunt.registerTask('validate', ['json-schema', 'karma:continuous', 'integration', 'coverage']);
};
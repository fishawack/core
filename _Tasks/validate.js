module.exports = grunt => {
    grunt.registerTask('validate', module.exports.tasks.validate);
};

module.exports.tasks = {
    validate: ['json-schema', 'karma:continuous', 'integration', 'coverage']
}
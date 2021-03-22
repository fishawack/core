module.exports = grunt => {
    grunt.registerTask('capture', ['connect:default', 'webdriver:default']);
};
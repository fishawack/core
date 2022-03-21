module.exports = grunt => {
    grunt.registerTask('capture', ['clean:build', 'connect:default', 'webdriver:default']);
};
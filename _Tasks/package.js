module.exports = function(grunt) {
    grunt.registerTask('package', ['compress:app', 'packageElectron', 'ftpscript:package']);
};
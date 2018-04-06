module.exports = function(grunt) {
	grunt.registerTask('pdf', ['clean:pdf', 'connect', 'webdriver:pdf', 'shell:pdf', 'clean:build']);
};
module.exports = function(grunt) {
	grunt.registerTask('pdf', ['clean:pdfs', 'connect', 'webdriver', 'clean:build', 'shell:pdf']);
};
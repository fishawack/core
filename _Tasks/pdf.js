module.exports = function(grunt) {
	grunt.registerTask('pdf', ['clean:pdf', 'connect', 'webdriver:pdf', 'compare:browsers', 'shell:pullPrevious', 'compare:previous', 'shell:pushPrevious', 'clean:build']);
};
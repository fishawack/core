module.exports = function(grunt) {
	grunt.registerTask('pdf', function(){
		if(!deployEnv.pdf){
	        grunt.log.warn('No pdf generation for ' + deployTarget);
	        return;
	    }

		grunt.task.run(['connect', 'webdriver', 'clean:build', 'shell:pdf']);
	});
};
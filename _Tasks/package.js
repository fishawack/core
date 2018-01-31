module.exports = function(grunt) {
    grunt.registerTask('package', function(){
    	var package = ['clean:pdfs', 'electron', 'pdf'];

        if(deployTarget === 'production'){
	        package.push('compress:app');
	    }

	    package.push('ftpscript:package');

        grunt.task.run(package);
    });
};
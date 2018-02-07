module.exports = function(grunt) {
	var jsdom = require("jsdom");
	
    grunt.registerTask('compile-vue', function(){
    	var cwd = '_Build/vue/';

	    grunt.file.expand({cwd: cwd}, '**/*.vue').forEach(function(element, index){
            var template = grunt.file.read(cwd + element);

            var document = jsdom.jsdom(template);

            grunt.file.write('.tmp/vue/' + element, document.querySelector('template').innerHTML);
        });
    });
};
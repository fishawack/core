module.exports = function(grunt) {	
    grunt.registerTask('compile-vue', function(){
        var jsdom = require("jsdom");
        
    	var cwd = `${config.src}/vue/`;

	    grunt.file.expand({cwd: cwd}, '**/*.vue').forEach(function(element, index){
            var template = grunt.file.read(cwd + element);

            var document = jsdom.jsdom(template);

            grunt.file.write('.tmp/vue/' + element, document.querySelector('template').innerHTML);
        });
    });
};
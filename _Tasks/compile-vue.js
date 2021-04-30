module.exports = function(grunt) {	
    grunt.registerTask('compile-vue', function(){
        // Only run postcss uncss on branches with deploy targets or on production builds, too slow for feature/dev branches on watch
	    // Checking keys length as if no deployEnv === {} which would still pass
        if(process.env.NODE_ENV === 'production' || Object.keys(deployEnv).length){
            var jsdom = require("jsdom");
        
            var cwd = `${config.src}/vue/`;

            grunt.file.expand({cwd: cwd}, '**/*.vue').forEach(function(element, index){
                var template = grunt.file.read(cwd + element);

                var document = jsdom.jsdom(template);

                grunt.file.write('.cache/vue/' + element, document.querySelector('template').innerHTML);
            });
        }
    });
};
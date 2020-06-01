module.exports = function(grunt) {
    grunt.registerTask('reset', function() {
        for(var key in reset){
            if(reset.hasOwnProperty(key)){
                grunt.config.set(key, reset[key]);
            }
        }

        reset = null;
    });
};
module.exports = function(grunt) {
    grunt.registerTask('package:vablet', function() {
        grunt.task.run('vablet', 'compress:app');
    });

    grunt.registerTask('vablet', function(){
        grunt.file.write('_App/VabletLoadSettings.json', JSON.stringify(contentJson.attributes.vablet, null, 4)); 
    });
};
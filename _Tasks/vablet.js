module.exports = function(grunt) {
    grunt.registerTask('package:vablet', function() {
        grunt.task.run('clean:vablet', 'vablet');
    });

    grunt.registerTask('vablet', function(){
        grunt.file.write('_Packages/Vablet/VabletLoadSettings.json', JSON.stringify(contentJson.attributes.vablet || {}, null, 4)); 
        
        grunt.task.run('copy:vablet');
    });
};
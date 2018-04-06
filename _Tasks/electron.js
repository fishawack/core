module.exports = function(grunt) {
    grunt.registerTask('package:electron', ['clean:electron', 'copy:electron', 'write:electron', 'electron']);

    grunt.registerTask('write:electron', function(){
        grunt.file.write('_Packages/Electron/App/package.json', JSON.stringify({
            "name": contentJson.attributes.title.toLowerCase().replace(/ /g,'-'),
            "version": "1.0.0",
            "main": "index.js"
        }, null, 4));
    });
};
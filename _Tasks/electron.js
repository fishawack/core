module.exports = function(grunt) {
    grunt.registerTask('electron', function(){
        if(!contentJson.attributes.electron){
            grunt.log.warn('Skipping electron package');
            return;
        }

        var packageJson = {
                "name": contentJson.attributes.title.toLowerCase().replace(/ /g,'-'),
                "version": "1.0.0",
                "main": "index.js"
            };

        grunt.registerTask('writeJson', function(){
            grunt.file.write('_App/package.json', JSON.stringify(packageJson, null, 4));
        });

        grunt.task.run([
            'clean:app',
            'clean:electron',
            'copy:app',
            'copy:electron',
            'writeJson',
            'electron',
            'compress:mac',
            'compress:win'
        ]);
    });
};
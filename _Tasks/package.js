module.exports = function(grunt) {
    grunt.registerTask('package', function(){
        var package = ['clean:zip'];

        /* PDF */
        deployEnv.pdf ? package.push('pdf', 'ftpscript:pdf') : grunt.log.warn('No pdf generation for ' + deployTarget);

        /* APP */
        package.push('compress:app');

        if(deployTarget === 'production'){
            /* ELECTRON */
            (contentJson.attributes.electron) ? package.push('package:electron', 'compress:mac', 'compress:win') : grunt.log.warn('No electron packaging specified');

            /* PHONEGAP */
            (contentJson.attributes.phonegap) ? package.push('package:phonegap', 'compress:ios') : grunt.log.warn('No phonegap packaging specified');

            /* AUTO-PACKAGE */
            package.push('ftpscript:package');
        } else {
            contentJson.attributes.electron && grunt.log.warn('No electron packaging for ' + deployTarget)
        }

        grunt.task.run(package);
    });
};
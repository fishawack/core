module.exports = function(grunt) {
    grunt.registerTask('package', function(){
        var package = ['clean:zip'];

        /* CAPTURE */
        if( 
            contentJson.attributes.pdf ||
            contentJson.attributes.veeva ||
            contentJson.attributes.cegedim
        ){
            package.push('capture');
        }
        
        /* PDF */
        (contentJson.attributes.pdf) ? package.push('package:pdf', 'ftpscript:pdf') : grunt.log.warn('No pdf packaging detected');

        /* VABLET */
        (contentJson.attributes.vablet) ? package.push('package:vablet', 'compress:vablet') : grunt.log.warn('No vablet packaging detected');

        /* VEEVA */
        (contentJson.attributes.veeva) ? package.push('package:veeva', 'compress:veeva') : grunt.log.warn('No veeva packaging detected');

        /* CEGEDIM */
        (contentJson.attributes.cegedim) ? package.push('package:cegedim', 'compress:cegedim') : grunt.log.warn('No cegedim packaging detected');

        /* APP */
        package.push('compress:app');

        /* HANDOVER */
        (contentJson.attributes.handover) ? package.push('package:handover', 'compress:handover') : grunt.log.warn('No handover packaging detected');

        /* ELECTRON */
        (contentJson.attributes.electron) ? package.push('package:electron', 'compress:mac', 'compress:win') : grunt.log.warn('No electron packaging specified');

        /* PHONEGAP */
        (contentJson.attributes.phonegap) ? package.push('package:phonegap', 'compress:ios') : grunt.log.warn('No phonegap packaging specified');

        /* AUTO-PACKAGE */
        package.push('ftpscript:package');

        /* WATERTIGHT */
        deployEnv.loginType ? package.push('package:watertight', 'compress:watertight') : grunt.log.warn('No watertight specified');

        /* DEPLOY */
        deployEnv ? package.push('package:deploy') : grunt.log.warn('No deploy packaging specified');

        grunt.task.run(package);
    });
};
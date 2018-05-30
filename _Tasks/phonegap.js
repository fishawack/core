var exec = require('child_process').exec;

module.exports = function(grunt) {
    grunt.registerTask('createConfigXml', function() {
        var xmlBuilder = require('xmlBuilder');
        grunt.file.write('_Packages/Phonegap/config.xml', xmlBuilder.create(
                JSON.parse(grunt.template.process(grunt.file.read(configPath + 'phonegap.json')))
            ).end({ pretty: true})
        )
    });

    grunt.registerTask('waitForAppBuild', function(){
        var done = this.async();

        grunt.log.writeln('Polling phonegap build...');

        checkAppStatus("curl " + grunt.template.process('https://build.phonegap.com/api/v1/apps/<%= contentJson.attributes.phonegap.appID %>/ios?auth_token=9tsERPEn2PamsbzFFjAB'), done, grunt);
    })

    grunt.registerTask('package:phonegap', function(){
        if(!contentJson.attributes.phonegap){
            return;
        }

        grunt.task.run([
            'clean:phonegap',
            'createConfigXml',
            'copy:phonegap',
            'compress:phonegap',
            'shell:pushApp',
            'waitForAppBuild',
            'shell:pullApp'
        ]);
    });
};

function checkAppStatus(command, done, grunt){
    exec(command, function(error, stdout, stderr) {
        var response = JSON.parse(stdout);

        if(response.error){
            grunt.log.warn('App still processing...');
            grunt.verbose.warn(response.error);
            setTimeout(function(){
                checkAppStatus(command, done, grunt);
            }, 2000);
        } else {
            grunt.log.ok("App ready");
            grunt.config.set('pullApp', response.location)
            done();
        }
    });
}
var exec = require('child_process').exec;

module.exports = function(grunt) {
    grunt.registerTask('createConfigXml', function() {
        var xmlBuilder = require('xmlbuilder');

        var phonegap = JSON.parse(grunt.template.process(grunt.file.read(configPath + 'phonegap.json')));

        (contentJson.attributes.phonegap.platforms || ['ios']).forEach((platform) => {
            phonegap.widget.platform.push(
                _.mergeWith(
                    JSON.parse(grunt.file.read(`${configPath}_Resources/Phonegap/${platform}.json`)), 
                    contentJson.attributes.phonegap[platform] || {}, 
                    (obj, src) => {
                        if (_.isArray(obj)) {
                            return obj.concat(src);
                        }
                    }
                )
            );
        });

        phonegap = _.mergeWith(phonegap, contentJson.attributes.phonegap.config || {}, (obj, src) => {
            if (_.isArray(obj)) {
                return obj.concat(src);
            }
        });

        grunt.file.write('_Packages/Phonegap/config.xml', xmlBuilder.create(phonegap).end({ pretty: true}));
    });

    grunt.registerTask('waitForAppBuild', function(){
        var done = this.async();

        grunt.log.ok('Polling phonegap build...');

        checkAppStatus("curl " + grunt.template.process('https://build.phonegap.com/api/v1/apps/<%= contentJson.attributes.phonegap.appID %>?auth_token=<%= config.targets.misc.phonegap.token %>'), done, grunt);
    });

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

        if(response.status.ios === 'error'){
            grunt.fatal('Phonegap build failed - ' + response.error.ios);
            return;
        } else if(response.status.ios === 'complete') {
            grunt.log.ok("App ready - downloading...");
            
            getAppLocation("curl " + grunt.template.process('https://build.phonegap.com/api/v1/apps/<%= contentJson.attributes.phonegap.appID %>/ios?auth_token=<%= config.targets.misc.phonegap.token %>'), done, grunt);
            return;
        }

        grunt.log.warn('App still processing...');

        setTimeout(function(){
            checkAppStatus(command, done, grunt);
        }, 2000);
    });
}

function getAppLocation(command, done, grunt){
    exec(command, function(error, stdout, stderr) {
        var response = JSON.parse(stdout);

        var shell = grunt.config.get('shell');
        shell.pullApp.command += "\"" + response.location  + "\"";
        grunt.config.set('shell', shell);

        done();
    });
}
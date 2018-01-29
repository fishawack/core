module.exports = function(grunt) {
    grunt.registerTask('content', function(){

        var path = require('path');

        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }
        
        var shell = {
            options: {
                execOptions: {
                    maxBuffer: 20000 * 1024
                },
                stderr: true,
                stdout: true
            },
            content: {
                command: []
            }
        };

        contentJson.attributes.content.forEach(function(d){
            if(d.ftp){
                shell.content.command.push('wget -r --user=\"<%= targets.ftp["' + d.ftp + '"].username %>\" --password=\"<%= targets.ftp["' + d.ftp + '"].password %>\" -P _Build/content/ -nH --cut=' + (d.location.split('/').length - 1) + ' ftp://' + d.ftp + '/' + d.location);
            } else if(d.url){
                d.endpoints.forEach(function(dd){
                    var location = path.normalize(d.location || '_Build/content/compile/');
                    
                    shell.content.command.push(((process.platform === "win32") ? 'mkdir ' + location : 'mkdir -p ' + location));

                    shell.content.command.push('wget -O ' + location + dd + ((d.ext) ? '.' + d.ext : '') + ' ' + d.url + '/' + dd);
                });
            } else {
                shell.content.command.push('scp -r <%= targets["' + d.ssh + '"].username %>@<%= targets["' + d.ssh + '"].host %>:' + d.location + ' _Build/content/');
            }
        });

        shell.content.command = shell.content.command.join(' && ');

        grunt.config.set('shell', shell);

        grunt.task.run('clean:content', 'shell:content');
    });
};

module.exports = function(grunt) {
    grunt.registerTask('content', function(){

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
                command: ['echo'] // Dummy command needed as fails with no commands
            }
        };

        contentJson.attributes.content.forEach(function(d){
            if(d.ftp){
                shell.content.command.push('wget -r --user=\"<%= targets.ftp["' + d.ftp + '"].username %>\" --password=\"<%= targets.ftp["' + d.ftp + '"].password %>\" -P ' + ((d.saveTo) ? d.saveTo : '_Build/content/') + ' -nH --cut=' + (d.location.split('/').length - 1) + ' ftp://' + d.ftp + '/' + d.location);
            } else if(d.ssh) {
                shell.content.command.push('scp -r <%= targets["' + d.ssh + '"].username %>@<%= targets["' + d.ssh + '"].host %>:' + d.location + ' ' + ((d.saveTo) ? d.saveTo : '_Build/content/'));
            }
        });

        shell.content.command = shell.content.command.join(' && ');

        grunt.config.set('shell', shell);

        grunt.task.run('clean:content', 'shell:content', 'content-request');
    });

    grunt.registerTask('content-request', function(){

        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var async = require('async');
        var request = require('request');
        var requests = [];

        contentJson.attributes.content.forEach(function(d){
            if(d.url){
                d.endpoints.forEach(function(dd){
                    requests.push({
                        name: dd,
                        request: d.url.replace(/\/+$/, "") + '/' + dd,
                        obj: d
                    });
                });
            }
        });

        if(requests.length){
            var done = this.async();

            async.forEach(requests, function(d, cb){
                load(d.request + '?per_page=100', function(data){
                    grunt.log.ok('Downloaded ' + d.name);

                    grunt.file.write((d.obj.saveTo || '_Build/content/compile/') + d.name + ((d.obj.ext) ? '.' + d.obj.ext : ''), JSON.stringify(data));

                    cb();
                });
            }, function(err){
                if(err){
                    grunt.log.warn(err.message);
                }

                done();
            });
        }

        function load(path, cb, arr){
            var offset = (arr) ? "&offset=" + arr.length : "";

            request(path + offset, function (error, response, body) {
                if(!arr){
                    arr = JSON.parse(body);
                } else {
                    arr = arr.concat(JSON.parse(body));
                }

                if(arr.length < +response.headers["x-wp-total"]){
                    load(path, cb, arr);
                } else {
                    cb(arr);
                }
            });
        }
    });
};
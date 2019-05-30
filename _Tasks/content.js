module.exports = function(grunt) {
    grunt.registerTask('content', function(){

        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }
        
        var shell = {
            options: {
                execOptions: {
                    maxBuffer: 20000 * 2048
                },
                stderr: true,
                stdout: true
            },
            content: {
                command: []
            }
        };

        var commands = ['shell:content', 'content-request', 'copy:content'];

        contentJson.attributes.content.forEach(function(d, i){
            var saveTo = (d.saveTo) ? d.saveTo : `_Build/content/content-${i}/`;

            shell.content.command.push(`rm -rf ${saveTo}`);

            if(d.ftp || d.ftps){
                var protocol = (d.ftps) ? 'ftps' : 'ftp';
                var ip = (d.ftps) ? d.ftps : d.ftp;

                shell.content.command.push(`wget -r --user='<%= targets.ftp["${ip}"].username %>' --password='<%= targets.ftp["${ip}"].password %>' -P ${saveTo} -nH --cut=${d.location.split('/').length - 1} '${protocol}://${ip}/${d.location}'`);
            } else if(d.ssh) {
                shell.content.command.push(`scp -r <%= targets["${d.ssh}"].username %>@<%= targets["${d.ssh}"].host %>:${d.location} ${saveTo}`);
            } else if(d.lftp){
                // Remove the rm -rf command as lftp needs to mirror
                shell.content.command.pop();

                shell.content.command.push(`lftp -d -e 'mirror ${d.location} ${saveTo} -p -e --parallel=10; exit;' -u '<%= targets.ftp["${d.lftp}"].username %>',<%= targets.ftp["${d.lftp}"].password %> sftp://${d.lftp}`);
            }
        });

        shell.content.command = shell.content.command.join(' && ');

        grunt.config.set('shell', shell);

        grunt.task.run(commands);
    });

    grunt.registerTask('content-request', function(){

        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var async = require('async');
        var request = require('request');
        var requests = [];

        contentJson.attributes.content.forEach(function(d, i){
            if(d.url){
                d.endpoints.forEach(function(dd){
                    requests.push({
                        name: dd,
                        request: d.url.replace(/\/+$/, "") + '/' + dd,
                        obj: d,
                        i: i
                    });
                });
            }
        });

        if(requests.length){
            var done = this.async();

            async.forEach(requests, function(d, cb){
                var saveTo = (d.obj.saveTo) ? d.obj.saveTo : `_Build/content/content-${d.i}/`;

                load(d.request + '?per_page=100', function(data){
                    grunt.log.ok('Downloaded ' + d.name);

                    grunt.file.write(saveTo + d.name + ((d.obj.ext) ? '.' + d.obj.ext : ''), JSON.stringify(data));

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
module.exports = (grunt) => {
    grunt.registerTask('content', ['content:pull', 'content:request']);

    grunt.registerTask('content:pull', function(){
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        const fs = require('fs-extra');
        const lftp = require('./helpers/lftp.js');

        function protocol(d, i){
            var saveTo = (d.saveTo) ? d.saveTo : `${config.src}/content/content-${i}`;

            if(d.ftp || d.ftps){
                var protocol = (d.ftps) ? 'ftps' : 'ftp';
                var ip = (d.ftps) ? d.ftps : d.ftp;

                fs.removeSync(saveTo);

                return `wget -q --show-progress -r --user='<%= targets.ftp["${ip}"].username %>' --password='<%= targets.ftp["${ip}"].password %>' -P ${saveTo} -nH --cut=${d.location.split('/').length - 1} '${protocol}://${ip}/${d.location}'`;
            } else if(d.ssh) {
                fs.removeSync(saveTo);

                return `scp -r <%= targets["${d.ssh}"].username %>@<%= targets["${d.ssh}"].host %>:${d.location} ${saveTo}`;
            } else if(d.lftp){
                lftp.pull(
                    saveTo,
                    d.location,
                    config.targets.ftp[d.lftp].username,
                    config.targets.ftp[d.lftp].password,
                    d.lftp
                );

                return 'echo ""';
            }
        };

        const execSync = require('child_process').execSync;

        contentJson.attributes.content.map((d, i) => {
            if(d.location){
                grunt.log.warn(`Pulling content from: ${d.location}`);
            
                execSync(grunt.template.process(protocol(d, i), {data:config}), {encoding: 'utf8', stdio: 'inherit'});

                grunt.log.ok(`Content pulled from: ${d.location}`);
            }
        });
    });
};
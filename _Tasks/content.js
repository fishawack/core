module.exports = (grunt) => {
    grunt.registerTask('content', ['content:pull', 'content:request']);

    grunt.registerTask('content:pull', function(){
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            return;
        }

        var fs = require('fs-extra');

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
                return `lftp -e 'set sftp:auto-confirm yes; mirror ${d.location} ${saveTo} -p -e --parallel=10; exit;' -u '<%= targets.ftp["${d.lftp}"].username %>','<%= targets.ftp["${d.lftp}"].password %>' sftp://${d.lftp}`;
            }
        };

        const execSync = require('child_process').execSync;

        contentJson.attributes.content.map((d, i) => {
            grunt.log.warn(`Pulling content from: ${d.location}`);
            
            execSync(grunt.template.process(protocol(d, i), {data:config}), {encoding: 'utf8', stdio: 'inherit'});

            grunt.log.ok(`Content pulled from: ${d.location}`);
        });

        grunt.task.run(['content:request']);
    });
};
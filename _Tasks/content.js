module.exports = (grunt) => {
    grunt.registerTask('content', ['content:pull', 'content:request']);

    grunt.registerTask('content:pull', function(){
        const fs = require('fs-extra');
        if(!contentJson.attributes.content || contentJson.attributes.content.length <= 0){
            grunt.log.warn('No content to pull');
            fs.removeSync(`${config.src}/content/*`);
            return;
        }

        const path = require('path');
        const glob = require('glob');
        var existContent = glob.sync(`${config.src}/content/*`);
        if(contentJson.attributes.content.length < existContent.length)
        {
            var index = existContent.length - contentJson.attributes.content.length;
            for(index; index < existContent.length; index++ ) {
                fs.removeSync(`${config.src}/content/content-${index}`);
            }
        }
        const lftp = require('./helpers/lftp.js');

        function protocol(d, saveTo){
            const { host, username, password } = config.targets[d.lftp || d.ssh || d.ftps || d.ftp];

            if(d.ftp || d.ftps){
                const protocol = (d.ftps) ? 'ftps' : 'ftp';

                fs.removeSync(saveTo);

                return `wget -q --show-progress -r --user='${username}' --password='${password}' -P ${saveTo} -nH --cut=${d.location.split('/').length - 1} '${protocol}://${host}/${d.location}'`;
            } else if(d.ssh) {
                fs.removeSync(`.tmp/scp`);
                fs.mkdirpSync(`.tmp/scp`);

                fs.removeSync(saveTo);
                return `scp -r ${username}@${host}:${d.location} .tmp/scp`;
            } else if(d.lftp){
                lftp.pull(
                    saveTo,
                    d.location,
                    username,
                    password,
                    host
                );

                return 'echo ""';
            }
        };

        const execSync = require('child_process').execSync;

        contentJson.attributes.content.map((d, i) => {
            if(d.location){
                grunt.log.warn(`Pulling content from: ${d.location}`);
                
                const saveTo = (d.saveTo) ? d.saveTo : `${config.src}/content/content-${i}`;
            
                execSync(grunt.template.process(protocol(d, saveTo), {data:config}), {encoding: 'utf8', stdio: 'inherit'});

                if(d.ssh){
                    fs.moveSync(path.join(`.tmp/scp`, d.location.replace('~/', '')), saveTo);
                }

                grunt.log.ok(`Content pulled from: ${d.location}`);
            }
        });
    });
};
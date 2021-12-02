module.exports = function(grunt) {
    let opts = {encoding: 'utf8', stdio: 'inherit'};

    grunt.registerTask('package:deploy', ['clean:deploy', 'copy:deploy']);

    grunt.registerTask('copy:deploy', () => {
        const fs = require('fs-extra');
        const glob = require('glob');

        let dest = '_Packages/Deploy';
        let paths = deployEnv.paths || [deployEnv.loginType ? '_Packages/Watertight/*' : `${config.root}/*`];
        
        fs.removeSync(dest);
        fs.mkdirSync(dest, {recursive: true});
        
        paths.forEach(copy => {
            glob.sync(copy.src || copy, {dot:true}).forEach(src => {
                let filter = copy.ignore ? src => copy.ignore.indexOf(src) === -1 : null;

                let save = path.basename(src);

                if(copy.dest){
                    if(!fs.lstatSync(src).isDirectory()){
                        save = path.join(copy.dest, save);
                    } else {
                        save = copy.dest;
                    }
                }

                fs.copySync(src, path.join(dest, save), { filter });
            });
        });
    });

    grunt.registerTask('deploy', ['deploy:local:pre', 'deploy:server:pre', 'compress:deploy', 'deploy:files', 'deploy:local:post', 'deploy:server:post', 'ftpscript:badges']);

    function command(command){
        if(!deployValid()){return;}

        const execSync = require('child_process').execSync;

        execSync(command, opts);
    };

    grunt.registerTask('deploy:local:pre', () => deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.pre && command(deployEnv.commands.local.pre.join(' && ')));

    grunt.registerTask('deploy:local:post', () => deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.post && command(deployEnv.commands.local.post.join(' && ')));

    grunt.registerTask('deploy:server:pre', () => deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.pre && command(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`mkdir -p ${deployLocation}`, `cd ${deployLocation}`].concat(deployEnv.commands.server.pre).join(' && ')}'`));

    grunt.registerTask('deploy:server:post', () => deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.post && command(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`cd ${deployLocation}`].concat(deployEnv.commands.server.post).join(' && ')}'`));
    
    grunt.registerTask('deploy:files', function() {
        if(!deployValid()){return;}

        const execSync = require('child_process').execSync;
        
        let dest = '_Packages/Deploy';

        grunt.log.warn(`Deploying to: ${deployLocation}`);

        if(deployEnv.ftp){
            grunt.task.run('ftpscript:deploy');
        } else if(deployEnv.ssh){
            execSync(`scp -rpl 10000 ${dest}/. '${deployCred.username}'@'${deployCred.host}':${deployLocation}`, opts);
        } else if(deployEnv.lftp){
            execSync(`lftp -e 'set sftp:auto-confirm yes; mirror -R "${dest}" "${deployLocation}" -p --parallel=10; exit;' -u '${deployCred.username}','${deployCred.password}' sftp://${deployCred.host}`, opts);
        } else if(deployEnv['aws-eb']){
            execSync(`eb deploy`, opts)
        }

        grunt.log.ok(`Deployed to: ${deployLocation}`);
    });
};
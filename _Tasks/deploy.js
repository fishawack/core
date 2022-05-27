const path = require('path');

module.exports = function(grunt) {
    let opts = {encoding: 'utf8', stdio: 'inherit'};

    grunt.registerTask('package:deploy', ['clean:deploy', 'copy:deploy']);

    grunt.registerTask('copy:deploy', () => {
        const fs = require('fs-extra');
        const glob = require('glob');
        const symlinks = require('./helpers/symlinks.js');

        let dest = '_Packages/Deploy';
        let paths = deployEnv.paths || [deployEnv.loginType ? '_Packages/Watertight/*' : `${config.root}/*`];

        let count = {
            files: 0,
            directories: 0,
            symlinks: 0,
            resolved: 0
        };
        
        fs.removeSync(dest);
        fs.mkdirSync(dest, {recursive: true});
        
        paths.forEach(copy => {
            glob.sync(copy.src || copy, {dot:true}).forEach(src => {
                let filter = copy.ignore ? src => copy.ignore.indexOf(src) === -1 : null;

                let save = path.basename(src);
                let stats = fs.lstatSync(src);

                if(copy.dest){
                    // If src is a file and dest is a path to a directory i.e missing an extensions, then join the dest to the current src filename
                    if(!stats.isDirectory() && !path.extname(copy.dest)){
                        save = path.join(copy.dest, save);
                    } else {
                        save = copy.dest;
                    }
                }

                if(stats.isSymbolicLink()) count.symlinks++;
                if(stats.isDirectory()) count.directories++;
                else count.files++;

                fs.copySync(src, path.join(dest, save), { filter }); count.paths++;
            });

            count.resolved = symlinks.resolve(path.dirname(copy.src || copy), dest);
        });

        grunt.log.ok(`${count.files} files, ${count.directories} directories, ${count.symlinks} symlinks copied. ${count.resolved} symlinks resolved`);
    });

    grunt.registerTask('deploy', ['deploy:local:pre', 'deploy:server:pre', 'compress:deploy', 'deploy:files', 'deploy:local:post', 'deploy:server:post', 'ftpscript:badges']);

    function command(command){
        if(!deployValid()){return;}

        const execSync = require('child_process').execSync;

        execSync(command, opts);
    };

    grunt.registerTask('deploy:local:pre', () => deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.pre && command(deployEnv.commands.local.pre.join(' && ')));

    grunt.registerTask('deploy:local:post', () => deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.post && command(deployEnv.commands.local.post.join(' && ')));

    grunt.registerTask('deploy:server:pre', () => deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.pre && command(`${deployEnv['aws-eb'] ? `eb ssh -c` : `ssh -tt '${deployCred.username}'@'${deployCred.host}'`} '${[`mkdir -p ${deployLocation}`, `cd ${deployLocation}`].concat(deployEnv.commands.server.pre).join(' && ')}'`));

    grunt.registerTask('deploy:server:post', () => deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.post && command(`${deployEnv['aws-eb'] ? `eb ssh -c` : `ssh -tt '${deployCred.username}'@'${deployCred.host}'`} '${[`cd ${deployLocation}`].concat(deployEnv.commands.server.post).join(' && ')}'`));
    
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
            execSync(`eb deploy ${deployEnv['aws-eb']}`, opts)
        } else if(deployEnv['aws-s3']){
            execSync(`aws s3 sync "${dest}" "s3://${deployLocation}" --only-show-errors --profile "${deployEnv['aws-s3']}"`, opts)
        }

        grunt.log.ok(`Deployed to: ${deployLocation}`);
    });
};
const path = require('path');

module.exports = function(grunt) {
    let opts = {encoding: 'utf8', stdio: 'inherit'};

    grunt.registerTask('package:deploy', ['clean:deploy', 'copy:deploy']);

    grunt.registerTask('copy:deploy', () => {
        const fs = require('fs-extra');
        const glob = require('glob');
        const symlinks = require('./helpers/symlinks.js');
        const { isWatertight } = require('./helpers/include.js');

        let dest = '_Packages/Deploy';
        let paths = deployEnv.paths || [isWatertight(deployEnv.loginType) ? '_Packages/Watertight/*' : `${config.root}/*`];

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

    grunt.registerTask('deploy', ['deploy:local:pre', 'deploy:server:pre', 'compress:deploy', 'deploy:files', 'deploy:local:post', 'deploy:server:post']);

    function command(command){
        if(!deployValid()){return;}

        const execSync = require('child_process').execSync;

        execSync(command, opts);
    };

    grunt.registerTask('deploy:local:pre', () => deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.pre && command(deployEnv.commands.local.pre.join(' && ')));

    grunt.registerTask('deploy:local:post', () => deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.post && command(deployEnv.commands.local.post.join(' && ')));

    grunt.registerTask('deploy:server:pre', () => {
        if(deployEnv['aws-eb'] || deployEnv['aws-s3'] || deployEnv['ftp']){
            grunt.log.warn(`Server commands not supported for the following protocols: {eb,s3,ftp}`);
            return;
        }

        deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.pre && command(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`mkdir -p ${deployLocation}`, `cd ${deployLocation}`].concat(deployEnv.commands.server.pre).join(' && ')}'`);
    });

    grunt.registerTask('deploy:server:post', () => {
        if(deployEnv['aws-cloudfront']){
            const execSync = require('child_process').execSync;
            
            let timestamp = new Date().getTime();
            let response;
            
            grunt.log.warn(`Invalidating cloudfront cache...`);

            do{
                response = JSON.parse(execSync(`aws cloudfront create-invalidation --distribution-id "${deployEnv['aws-cloudfront']}" --invalidation-batch "Paths={Quantity=1,Items='/*'},CallerReference='${timestamp}'" --profile "${deployEnv['aws-s3']}"`, {encoding: 'utf8'}));

                grunt.log.warn(`Cloudfront cache invalidation: ${response.Invalidation.Status}`);

                if(response.Invalidation.Status === "InProgress"){
                    execSync('sleep 20');
                }
            } while(response.Invalidation.Status === "InProgress");

            grunt.log.ok(`Cloudfront ${response.Invalidation.Id}: invalidated successfully`);
        }
        
        if(deployEnv['aws-eb'] || deployEnv['aws-s3'] || deployEnv['ftp']){
            grunt.log.warn(`Server commands not supported for the following protocols: {eb,s3,ftp}`);
            return;
        }

        deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.post && command(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`cd ${deployLocation}`].concat(deployEnv.commands.server.post).join(' && ')}'`);
    });
    
    grunt.registerTask('deploy:files', function() {
        if(!deployValid()){return;}

        const execSync = require('child_process').execSync;
        
        let dest = '_Packages/Deploy';

        grunt.log.warn(`Deploying to: ${deployLocation}`);

        if(deployEnv.ftp){
            grunt.fatal('Deploying via ftp is no longer supported');
        } else if(deployEnv.ssh){
            execSync(`scp -rpl 10000 _Zips/Deploy.zip '${deployCred.username}'@'${deployCred.host}':'${deployLocation}' && ssh -tt '${deployCred.username}'@'${deployCred.host}' 'unzip -o \'${deployLocation}/Deploy.zip\' -d \'${deployLocation}/\' && rm -rf \'${deployLocation}/Deploy.zip\''`, opts);
        } else if(deployEnv.lftp){
            execSync(`lftp -e 'set sftp:auto-confirm yes; mirror -R "${dest}" "${deployLocation}" -p --parallel=10; exit;' -u '${deployCred.username}','${deployCred.password}' sftp://${deployCred.host}`, opts);
        } else if(deployEnv['aws-eb']){
            const timeout = Number((typeof deployEnv['eb-timeout'] !== 'undefined') ? deployEnv['eb-timeout'] : '30');
            execSync(`eb deploy ${deployEnv['aws-eb']} --timeout ${timeout}`, opts)
        } else if(deployEnv['aws-s3']){
            execSync(`aws s3 sync "${dest}" "s3://${deployLocation}" --delete --only-show-errors --profile "${deployEnv['aws-s3']}"`, opts)
        }

        grunt.log.ok(`Deployed to: ${deployLocation}`);
    });
};
module.exports = function(grunt) {
    grunt.registerTask('package:deploy', () => {
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

    grunt.registerTask('deploy', ['deploy:local:pre', 'deploy:server:pre', 'deploy:files', 'deploy:local:post', 'deploy:server:post', 'ftpscript:badges']);

    function command(command){
        if(!deployLocation){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        const execSync = require('child_process').execSync;

        execSync(command, {encoding: 'utf8', stdio: 'inherit'});
    };

    grunt.registerTask('deploy:local:pre', () => command(deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.pre.join(' && ')));

    grunt.registerTask('deploy:local:post', () => command(deployEnv.commands && deployEnv.commands.local && deployEnv.commands.local.post.join(' && ')));

    grunt.registerTask('deploy:server:pre', () => command(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`mkdir -p ${deployLocation}`, `cd ${deployLocation}`].concat(deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.pre).join(' && ')}'`));

    grunt.registerTask('deploy:server:post', () => command(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`cd ${deployLocation}`].concat(deployEnv.commands && deployEnv.commands.server && deployEnv.commands.server.post).join(' && ')}'`));
    
    grunt.registerTask('deploy:files', async function() {
        let done = this.async();

        if(!deployLocation){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }

        const execSync = require('child_process').execSync;
        const ora = require('ora');
        const exec = require('child_process').exec;

        let dest = '_Packages/Deploy';

        if(deployEnv.ftp){
            grunt.task.run('ftpscript:deploy');
        } else if(deployEnv.ssh){
            execSync(`scp -rpl 10000 ${dest}/. '${deployCred.username}'@'${deployCred.host}':${deployLocation}`, {stdio: 'inherit'});
        } else if(deployEnv.lftp){
            try {
                await new Promise((resolve, reject) => {
                    let spinner = ora(`Deploying to: ${deployLocation}`).start();
                    
                    exec(`lftp -d -e 'set sftp:auto-confirm yes; mirror -R "${dest}" "${deployLocation}" -p --parallel=10; exit;' -u '${deployCred.username}','${deployCred.password}' sftp://${deployCred.host}`, {maxBuffer: 20000 * 1024}, (error, stdout, stderr) => {
                        if(error){
                            spinner.fail();
                            reject(error);
                            return;
                        }

                        spinner.succeed();
                        resolve(stdout.trim());
                    });
                });
            } catch(e){
                grunt.fatal(e.message);
            }
        }

        if(deployEnv.loginType){
            execSync(
                `ssh -tt '${deployCred.username}'@'${deployCred.host}' 'mkdir -p ${deployLocation}/logs;'`
            );
        }

        done();
    });
};
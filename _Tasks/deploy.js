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

    grunt.registerTask('deploy:local:pre', () => {
        if(!deployLocation){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }

        const execSync = require('child_process').execSync;

        const commands = deployEnv.commands || {};
        const local = commands.local || {};

        local.pre && execSync(local.pre.join(' && '), {encoding: 'utf8', stdio: 'inherit'});
    });

    grunt.registerTask('deploy:local:post', () => {
        if(!deployLocation){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }
        
        const execSync = require('child_process').execSync;

        const commands = deployEnv.commands || {};
        const local = commands.local || {};

        local.post && execSync(local.post.join(' && '), {encoding: 'utf8', stdio: 'inherit'});
    });

    grunt.registerTask('deploy:server:pre', () => {
        if(!deployLocation){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }

        const execSync = require('child_process').execSync;

        const commands = deployEnv.commands || {};
        const server = commands.server || {};

        server.pre && execSync(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`cd ${deployLocation}`].concat(server.pre).join(' && ')}'`, {encoding: 'utf8', stdio: 'inherit'});
    });

    grunt.registerTask('deploy:server:post', () => {
        if(!deployLocation){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }
        
        const execSync = require('child_process').execSync;

        const commands = deployEnv.commands || {};
        const server = commands.server || {};

        server.post && execSync(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`cd ${deployLocation}`].concat(server.post).join(' && ')}'`, {encoding: 'utf8', stdio: 'inherit'});
    });
    
    grunt.registerTask('deploy', async function() {
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

        let deploy = ['ftpscript:badges'];
        let dest = '_Packages/Deploy';

        if(deployEnv.ftp){
            deploy.push('ftpscript:deploy');
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

        grunt.task.run(deploy);

        done();
    });
};
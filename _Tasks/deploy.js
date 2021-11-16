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
    
    grunt.registerTask('deploy', async function() {
        let done = this.async();

        if(!deployEnv.location){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }

        const execSync = require('child_process').execSync;
        const ora = require('ora');
        const exec = require('child_process').exec;
        
        const commands = deployEnv.commands || {};
        const local = commands.local || {};
        const server = commands.server || {};

        local.pre && execSync(local.pre.join(' && '), {encoding: 'utf8', stdio: 'inherit'});
        server.pre && execSync(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`cd ${deployEnv.location}`].concat(server.pre).join(' && ')}'`, {encoding: 'utf8', stdio: 'inherit'});

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
                    
                    exec(`lftp -d -e 'set sftp:auto-confirm yes; mirror -R "${dest}" "${deployLocation}" -p --parallel=10; exit;' -u '${deployCred.username}','${deployCred.password}' sftp://${deployCred.host}`, (error, stdout, stderr) => {
                        if(error){
                            // If lftp trim the command itself so no creds are shown and only grab the last 100 chars
                            if(d.lftp){
                                error.message = error.message.split('Running connect program')[1].slice(-500);
                            }
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

        local.post && execSync(local.post.join(' && '), {encoding: 'utf8', stdio: 'inherit'});
        server.post && execSync(`ssh -tt '${deployCred.username}'@'${deployCred.host}' '${[`cd ${deployEnv.location}`].concat(server.post).join(' && ')}'`, {encoding: 'utf8', stdio: 'inherit'});

        grunt.task.run(deploy);

        done();
    });
};
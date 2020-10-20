module.exports = function(grunt) {
    grunt.registerTask('deploy', function(){
        if(!deployEnv){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }

        const execSync = require('child_process').execSync;

        var deploy = ['ftpscript:badges'];

        var path = deployEnv.loginType ? '_Packages/Watertight' : config.root;

        if(deployEnv.ftp){
            deploy.push('ftpscript:deploy');
        } else if(deployEnv.ssh){
            execSync(`scp -rpl 10000 ${path}/. '${deployCred.username}'@'${deployCred.host}':${deployLocation}`, {stdio: 'inherit'});
        } else if(deployEnv.lftp){
            execSync(`lftp -d -e 'set sftp:auto-confirm yes; mirror -R ${path} ${deployLocation} -p --parallel=10; exit;' -u '${deployCred.username}','${deployCred.passphrase}' sftp://${deployCred.host}`, {stdio: 'inherit'});
        }

        if(deployEnv.loginType){
            execSync(
                `ssh -tt '${deployCred.username}'@'${deployCred.host}' 'mkdir -p ${deployLocation}/logs;'`
            );
        }

        grunt.task.run(deploy);
    });
};
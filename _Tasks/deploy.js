module.exports = function(grunt) {
    grunt.registerTask('deploy', function(){
        if(!deployEnv){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }

        var deploy = ['ftpscript:badges'];

        if(deployEnv.ftp){
            deploy.push('ftpscript:deploy');
        } else if(deployEnv.loginType){
            deploy.push('sftp:deploy', 'sshexec:unpack', 'sshexec:required');
        } else if(deployEnv.ssh){
            deploy.push('sftp:deploy', 'sshexec:unpack');   
        } else if(deployEnv.lftp){
            require('child_process').execSync(`lftp -d -e 'set sftp:auto-confirm yes; mirror -R ${config.root} ${deployLocation.slice(0, -1)} -p --parallel=10; exit;' -u '${deployCred.username}','${deployCred.passphrase}' sftp://${deployCred.host}`);
        }

        if(!deployEnv.loginType){
            deploy.push('casperjs:deploy');
        }

        grunt.task.run(deploy);
    });
};
module.exports = function(grunt) {
    grunt.registerTask('deploy', function(){
        if(!deployEnv.ssh && !deployEnv.ftp){
            grunt.log.warn('No deployment configured for ' + deployTarget);
            return;
        }

        if(deployEnv.ftp && deployEnv.loginType){
            grunt.log.warn('Cannot deploy watertight over ftp');   
        }

        var deploy = ['ftpscript:badges'];

        if(deployEnv.ftp){
            deploy.push('ftpscript:deploy');
        } else if(deployEnv.loginType){
            deploy.push('watertight');
        } else{
            deploy.push('compress:deploy', 'sshexec:remove', 'sftp:deploy', 'sshexec:unpack');   
        }

        if(!deployEnv.loginType){
            deploy.push('casperjs:deploy');
        }

        grunt.task.run(deploy);
    });
};
module.exports = grunt => {
    grunt.registerTask('takedown', function(){
        if(!deployEnv){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp){
            grunt.log.warn('Cannot takedown over ftp');
        } else if(deployEnv.loginType){
            grunt.task.run('sshexec:' + ((deployEnv.subDir) ? 'subDir' : 'root'));
        } else{
            grunt.task.run('sshexec:remove');
        }
    });
};
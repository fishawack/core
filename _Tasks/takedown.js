module.exports = grunt => {
    grunt.registerTask('takedown', function(){
        if(!deployEnv){
            grunt.log.warn('No deployment configured for ' + deployBranch);
            return;
        }

        if(deployEnv.ftp){
            grunt.log.warn('Cannot takedown over ftp');
        } else{
            require('child_process').execSync(`ssh -tt '${deployCred.username}'@'${deployCred.host}' 'rm -rf ${deployLocation}'`);
        }
    });
};
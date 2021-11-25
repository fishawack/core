module.exports = grunt => {
    grunt.registerTask('takedown', function(){
        if(!deployValid()){return;}

        if(deployEnv.ftp){
            grunt.log.warn('Cannot takedown over ftp');
        } else{
            require('child_process').execSync(`ssh -tt '${deployCred.username}'@'${deployCred.host}' 'rm -rf ${deployLocation}'`);
        }
    });
};
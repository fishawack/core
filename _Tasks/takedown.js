module.exports = grunt => {
    grunt.registerTask('takedown', function(){
        if(!deployValid()){return;}

        if(deployEnv.ftp){
            grunt.log.warn('Cannot takedown over ftp');
        } else if(deployEnv['aws-s3']){
            require('child_process').execSync(`aws s3 rm "s3://${deployLocation}" --recursive --profile "${deployEnv['aws-s3']}"`);
        } else{
            require('child_process').execSync(`ssh -tt '${deployCred.username}'@'${deployCred.host}' 'rm -rf ${deployLocation}'`);
        }
    });
};
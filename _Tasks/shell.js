const { execSync } = require('child_process');

module.exports = grunt => {
    grunt.registerMultiTask('shell', function(){
        shell(this.data.command, this.options().execOptions, this.options());
    });
};

function shell(command, execOptions = {}, options = {failOnError: true}){
    let output;
    
    try{
        output = execSync(command, Object.assign({}, {encoding: 'utf8', stdio: 'inherit'}, execOptions));
    } catch(e){
        if(options.failOnError){
            throw e;
        }
    }

    return output;
}

module.exports.shell = shell;
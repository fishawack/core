var exec = require('child_process').exec;

module.exports = function(grunt) {
    grunt.registerMultiTask('electron', function(){
        const options = this.options();

        require('child_process').execSync(`electron-packager ${options.dir} ${options.name} --platform=${options.platform} --arch=${options.arch} --electronVersion=${options.electronVersion} --out=${options.out}`, {encoding: 'utf8', stdio: 'inherit'});
    });

    grunt.registerTask('package:electron', ['clean:electron', 'copy:electron', 'write:electron', 'install:electron', 'electron']);

    grunt.registerTask('write:electron', function(){
    	var package = {
            "name": config.repo.name,
            "version": grunt.config.get('pkg').version,
            "main": "index.js"
        };

        if(typeof contentJson.attributes.electron === 'object'){
        	package = Object.assign(package, contentJson.attributes.electron);
        }

        grunt.file.write('_Packages/Electron/App/package.json', JSON.stringify(package, null, 4));
    });

    grunt.registerTask('install:electron', function(){
        var done = this.async();

        grunt.log.writeln('Installing electron dependencies...');

        exec('npm --prefix _Packages/Electron/App install --no-save _Packages/Electron/App --production', function(error, stdout, stderr) {
        	
	        console.log(stdout, stderr);

	        done();
	    });
    });
};
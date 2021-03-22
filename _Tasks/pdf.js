module.exports = function(grunt) {
	grunt.registerTask('package:pdf', ['clean:pdf', 'pdf', 'compare:browsers', 'shell:pullPrevious', 'compare:previous', 'shell:pushPrevious', 'clean:build']);

	grunt.registerTask('pdf', function() {
		var done = this.async();

		var createPdfsAndZips = require('../_Node/createPdfsAndZips');
		var arr = [];

		for(var i = 0; i < captureEnv().browsers.length; i++){			
			arr.push(createPdfsAndZips(
				`${captureEnv().browsers[i]}/${captureEnv().sizes[i][0]}x${captureEnv().sizes[i][1]}`,
				'.tmp/screenshots',
				`${config.filename}_${captureEnv().sizes[i][0]}x${captureEnv().sizes[i][1]}_${captureEnv().browsers[i]}.pdf`
			));
		}

		Promise.all(arr).then((res) => done());
	});
};
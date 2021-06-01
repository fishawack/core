module.exports = function(grunt) {
	grunt.registerTask('package:pdf', ['clean:pdf', 'pdf', 'compare:browsers', 'shell:pullPrevious', 'compare:previous', 'shell:pushPrevious', 'clean:build']);

	grunt.registerTask('pdf', function() {
		var done = this.async();

		var createPdfsAndZips = require('../_Node/createPdfsAndZips');
		var arr = [];

		captureEnv().browsers.forEach(browser => 
			captureEnv().sizes.forEach(size => 
				arr.push(createPdfsAndZips(
					`${browser}/${size[0]}x${size[1]}`,
					'.tmp/screenshots',
					`${config.filename}_${size[0]}x${size[1]}_${browser}.pdf`
				).then(res => console.log(`Pdf generated for: ${res}`)))
			)
		);

		Promise.all(arr).then((res) => done());
	});
};
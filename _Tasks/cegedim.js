module.exports = function(grunt) {
    grunt.registerTask('package:cegedim', ['cegedim']/*function() {
    	/* TODO - add back in thumbnail generation / write parameters */

    	//grunt.file.write('_Output/'+ element +'/parameters/parameters.xml', '<Sequence Id="'+ element +'" xmlns="urn:param-schema"></Sequence>');

    	/* _Output/'+element+'/media/images/thumbnails/200x150.jpg */
        //grunt.task.run();
    /*}*/);

    grunt.registerTask('cegedim', () => {
    });

    grunt.registerTask('packImagesFlat', function() {

		var pdf_imagepack = grunt.config.get('pdf_imagepack') || {};
		var shell = grunt.config.get('shell') || {};

        var browsers = captureEnv().browsers;
		var sizes = captureEnv().sizes;

		var captureFiles = grunt.file.expand({cwd: './'}, `.tmp/screenshots/${browsers[0]}/${sizes[0][0]}x${sizes[0][1]}/*.png`);

		var sequences = {};

		captureFiles.forEach(function(d){
			var split = d.substr(d.lastIndexOf('/') + 1);
			var name = split.split('.')[1];

			if(!sequences[name]){
				sequences[name]= [];
			};

			sequences[name].push(d);
		});

		for(var key in sequences){
			sequences[key].sort(function(a, b){
				var splitA = a.substr(a.lastIndexOf('/') + 1);
				var splitB = b.substr(b.lastIndexOf('/') + 1);

				a = +splitA.split('.')[0];
				b = +splitB.split('.')[0];

				if(a > b){
					return 1;
				} else if(a < b){
					return -1;
				}
				return 0;
			});

			pdf_imagepack[key] = {
				files: {}
			};

			pdf_imagepack[key].files['.tmp/pdfs/' + key + '.pdf'] = sequences[key]

			shell.pdf.command.push("mkdir -p _Output/" + key + "/export && gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Output/" + key + "/export/export.pdf' '.tmp/pdfs/" + key + ".pdf'");
		}

		shell.pdf.command = shell.pdf.command.join(' && ');

		grunt.config.set('shell', shell);
        grunt.config.set('pdf_imagepack', pdf_imagepack);

        grunt.task.run('pdf_imagepack', 'shell:pdf');
    });
};
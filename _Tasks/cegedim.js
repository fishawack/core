module.exports = function(grunt) {
    grunt.registerTask('package:cegedim', ['clean:cegedim', 'cegedim']);

    grunt.registerTask('cegedim', function() {
        var glob = require('glob');
        var browsers = captureEnv().browsers;
		var sizes = captureEnv().sizes;
		var fs = require('fs-extra');

        reset = {
            compress: grunt.config.get('compress'),
            clean: grunt.config.get('clean'),
            copy: grunt.config.get('copy')
        };

        var copy = {
        	default: {
        		files: []
        	}
        };

        var shell = {
        	default: {
        		command: []
        	}
        };

        var compress = {};

        var clean = {
            default: {
                src: []
            }
        };

        keyMessages.forEach(d => {
            var zipName = d.zipName;
            var seqName = d.seqName;
            var screenshotName = d.screenshotName;

            var screenshot = alphanumSort(glob.sync(`.tmp/screenshots/${browsers[0]}/${sizes[0][0]}x${sizes[0][1]}/*_${screenshotName}_*.png`))[0];

        	copy.default.files.push(
                {
                    cwd: d.root,
                    src: '**',
                    dest: '_Packages/Cegedim/' + zipName + '/',
                    expand: true
                }
			);
			
			fs.mkdirpSync(`_Packages/Cegedim/${zipName}/media/images/thumbnails/`);

            shell.default.command.push(
            	`convert ${screenshot} -resize 200x150 _Packages/Cegedim/${zipName}/media/images/thumbnails/200x150.jpg`
			);
			
			shell.default.command.push(`mkdir -p _Packages/Cegedim/${zipName}/export && gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Packages/Cegedim/${zipName}/export/export.pdf' '.tmp/pdfs/cegedim/${zipName}.pdf'`)

            compress[zipName] = {
                "options": {'archive': '_Packages/Cegedim/'+ zipName +'.zip'}, 
                'cwd': '_Packages/Cegedim/'+ zipName +'/', 
                'src': ['**'],
                'expand': true
            };

            clean.default.src.push('_Packages/Cegedim/' + zipName + '/');

            var multiStr =  `<Sequence Id="fishawack-${zipName}" Orientation="Landscape" NumberOfSlides="${keyMessages.length}" xmlns="urn:param-schema"></Sequence>`;

            grunt.file.write(`_Packages/Cegedim/${zipName}/parameters/parameters.xml`, multiStr);
        });

        shell.default.command = shell.default.command.join(' && ');

        grunt.config.set('copy', copy);
        grunt.config.set('shell', shell);
        grunt.config.set('compress', compress);
        grunt.config.set('clean', clean);

        grunt.task.run('copy', 'packImagesFlat', 'shell', 'compress', 'clean', 'reset');
	});
	
	grunt.registerTask('packImagesFlat', async function() {
        var done = this.async();
        var fs = require('fs-extra');
		var glob = require('glob');
        var browsers = captureEnv().browsers;
		var sizes = captureEnv().sizes;
        const pdfPack = require('../_Node/pdfPack.js');
        
        fs.mkdirpSync('.tmp/pdfs/cegedim/');

		for(var i = 0; i < keyMessages.length; i++){
            let d = keyMessages[i];
			var zipName = d.zipName;
			var screenshotName = d.screenshotName;

            await pdfPack(
                alphanumSort(glob.sync(`.tmp/screenshots/${browsers[0]}/${sizes[0][0]}x${sizes[0][1]}/*_${screenshotName}_*.png`)), 
                `.tmp/pdfs/cegedim/${zipName}.pdf`
            );
		}

        done();
    });
};
module.exports = function(grunt) {
	var PDFImagePack = require("pdf-image-pack");
	var async = require('async');
	var path = '.tmp/screenshots/';
	var merge = require('easy-pdf-merge');
	var fs = require('fs-extra');
	var exec = require('child_process').exec;

	grunt.file.mkdir('.tmp/pdfs/');

	this.createPdfsAndZips = function(browserName, width, height){
		describe(`Archiving and packing`, function () {
			before(function(){
	            fs.mkdirpSync(`.tmp/pdfs/`);
	        });

	    	it(`Merging pdfs`, function() {
			    var arrayOfScreens = [];

		        grunt.file.expand({cwd: path}, '*').forEach(function(element, index){
		        	arrayOfScreens.push(element);
		        });

		        arrayOfScreens.alphanumSort(false);

		        var pdfTasks = [];

		        for(var i = 0; i < arrayOfScreens.length; i++){
		        	pdfTasks.push((function(i){
		        		return function(callback){
			        		new PDFImagePack().output(
			        			[path + arrayOfScreens[i]], 
			        			((arrayOfScreens.length > 1) ? `.tmp/pdfs/${i}.pdf` : `.tmp/pdfs/raw.pdf`),
			        			function(err){
					            	if(err){
					            		console.log(err);
					            	}

				            		callback();
				            	});
			        	};
		        	}(i)));
		        }

		        browser.call(function () {
			        return new Promise(function(resolve, reject) {
			            async.series(pdfTasks, function(){
			            	if(arrayOfScreens.length > 1){
			            		merge(arrayOfScreens.map(
			            			function(d, i){return `.tmp/pdfs/${i}.pdf`;}), 
			            			`.tmp/pdfs/raw.pdf`,
			            			function(err){
								        if(err)
								        	return console.log(err);

								        resolve();
									});
			            	} else {
			            		resolve();
			            	}
			            });
			        });
			    });
	        });

	        it(`Optimizing pdf`, function() {
		        browser.call(function () {
			        return new Promise(function(resolve, reject) {
			        	var pdf = `${contentJson.attributes.title}_${width}x${height}_${grunt.template.today('yyyy-mm-dd')}_${browserName}.pdf`;

			        	var command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Pdfs/${pdf}' '.tmp/pdfs/raw.pdf'`;

			            exec(command, function(error, stdout, stderr) {
					        if(error){
					        	reject();
					        }

					        resolve();
					    });
			        });
			    });
	        });

	        after(function(){
	            fs.removeSync(`.tmp/pdfs/`);
	        });
	    });
	}
}
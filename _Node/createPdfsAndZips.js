module.exports = function(grunt) {
	var PDFImagePack = require("pdf-image-pack");
	var async = require('async');
	var merge = require('easy-pdf-merge');
	var fs = require('fs-extra');
	var exec = require('child_process').exec;

	fs.mkdirpSync('.tmp/pdfs/');

	this.createPdfsAndZips = (path, pdf) => {
		return new Promise(async (resolve, reject) => {
			fs.mkdirpSync(`.tmp/pdfs/${path}/`);

			var arrayOfScreens = [];

			grunt.file.expand({cwd: `.tmp/screenshots/${path}/`}, '*').forEach(function(element, index){
				arrayOfScreens.push(element);
			});

			arrayOfScreens.alphanumSort(false);

			var pdfTasks = [];

			for(var i = 0; i < arrayOfScreens.length; i++){
				pdfTasks.push((function(i){
					return function(callback){
						new PDFImagePack().output(
							[`.tmp/screenshots/${path}/` + arrayOfScreens[i]], 
							((arrayOfScreens.length > 1) ? `.tmp/pdfs/${path}/${i}.pdf` : `.tmp/pdfs/${path}/raw.pdf`),
							function(err){
								if(err){
									console.log(err);
								}

								callback();
							});
					};
				}(i)));
			}

			await new Promise(function(resolve, reject) {
				async.series(pdfTasks, function(){
					if(arrayOfScreens.length > 1){
						merge(arrayOfScreens.map(
							function(d, i){return `.tmp/pdfs/${path}/${i}.pdf`;}), 
							`.tmp/pdfs/${path}/raw.pdf`,
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
			
			await new Promise(function(resolve, reject) {
				var command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Pdfs/${pdf}' '.tmp/pdfs/${path}/raw.pdf'`;

				exec(command, function(error, stdout, stderr) {
					if(error){
						reject();
					}

					resolve();
				});
			});

			resolve();
		});
	}
}
module.exports = (path, folder, pdf) => {
	var PDFImagePack = require("pdf-image-pack");
	var async = require('async');
	var merge = require('easy-pdf-merge');
	var fs = require('fs-extra');
	var exec = require('child_process').exec;

	fs.mkdirpSync('.tmp/pdfs/');
	fs.mkdirpSync('_Pdfs');

	return new Promise(async (resolve, reject) => {
		fs.mkdirpSync(`.tmp/pdfs/${path}/`);

		var arrayOfScreens = [];

		grunt.file.expand({cwd: `${folder}/${path}/`}, '*').forEach(function(element, index){
			arrayOfScreens.push(element);
		});

		if(!arrayOfScreens.length){
			grunt.log.warn('No pages found');
			return resolve();
		}

		arrayOfScreens.alphanumSort(false);

		var pdfTasks = [];

		for(var i = 0; i < arrayOfScreens.length; i++){
			pdfTasks.push((function(i){
				return function(callback){
					new PDFImagePack().output(
						[`${folder}/${path}/` + arrayOfScreens[i]], 
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
			async.series(pdfTasks, () => {
				if(arrayOfScreens.length > 1){
					merge(
						arrayOfScreens.map((d, i) => `.tmp/pdfs/${path}/${i}.pdf`),
						`.tmp/pdfs/${path}/raw.pdf`,
						err => {
							if(err)
								return reject(err);

							resolve();
						});
				} else {
					resolve();
				}
			});
		})
		.catch(err => {
			reject(err);
		});
		
		await new Promise(function(resolve, reject) {
			var command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Pdfs/${pdf}' '.tmp/pdfs/${path}/raw.pdf'`;

			exec(command, function(err, stdout, stderr) {
				if(err){
					return reject(err);
				}

				resolve();
			});
		})
		.catch(err => {
			reject(err);
		});

		resolve();
	})
	.catch(err => {
		console.log(err);
	});
}
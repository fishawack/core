module.exports = (path, folder, pdf) => {
	const pdfPack = require('../_Node/pdfPack.js');
	var fs = require('fs-extra');
	var exec = require('child_process').exec;
	const glob = require('glob');

	fs.mkdirpSync('.tmp/pdfs/');
	fs.mkdirpSync('_Pdfs');

	return new Promise(async (resolve) => {
		fs.mkdirpSync(`.tmp/pdfs/${path}/`);

		var arrayOfScreens = [];

		glob.sync('*', {cwd: `${folder}/${path}/`}).forEach(function(element, index){
			arrayOfScreens.push(element);
		});

		if(!arrayOfScreens.length){
			console.log('No pages found');
			return resolve();
		}

		arrayOfScreens = alphanumSort(arrayOfScreens, false);

		await pdfPack(
			arrayOfScreens.map(d => `${folder}/${path}/${d}`), 
			`.tmp/pdfs/${path}/raw.pdf`
		);
		
		await new Promise(function(resolve, reject) {
			var command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile='_Pdfs/${pdf}' '.tmp/pdfs/${path}/raw.pdf'`;

			exec(command, function(err, stdout, stderr) {
				if(err){
					return reject(err);
				}

				resolve();
			});
		});

		resolve(path);
	})
	.catch(err => {
		console.log(err);
	});
}
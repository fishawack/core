module.exports = function(grunt) {
	var PDFImagePack = require("pdf-image-pack");
	var async = require('async');
	var path = '.tmp/screenshots/';
	var merge = require('easy-pdf-merge');

	grunt.file.mkdir('_Pdfs');
	grunt.file.mkdir('.tmp/pdfs/');

	this.createPdfsAndZips = function(){
		describe("Create pdf", function () {
		    it('Archiving and packing', function(done) {
				var arrayOfAllScreens = [];

			    var arrayOfScreens = [];

		        grunt.file.expand({cwd: '.tmp/screenshots/'}, '*').forEach(function(element, index){
		        	arrayOfScreens.push(element);
		        });

		        arrayOfScreens.alphanumSort(false);

		        var pdfTasks = [];

		        for(var i = 0; i < arrayOfScreens.length; i++){
		        	pdfTasks.push((function(i){
		        		return function(callback){
			        		new PDFImagePack().output([path + arrayOfScreens[i]], ((arrayOfScreens.length > 1) ? '.tmp/pdfs/' + i + '.pdf' : '_Pdfs/raw.pdf'), function(err){
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
			            		merge(arrayOfScreens.map(function(d, i){return '.tmp/pdfs/' + i + '.pdf';}), '_Pdfs/raw.pdf',function(err){
								        if(err)
								        	return console.log(err);

								        console.log('Successfully merged!');
								        resolve();
								});
			            	} else {
			            		resolve();
			            	}
			            });
			        });
			    });
	        });
        });
	}
}
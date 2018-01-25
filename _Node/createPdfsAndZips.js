module.exports = function(grunt) {
	var PDFImagePack = require("pdf-image-pack");
	var pdfCreator = new PDFImagePack();

	var path = '.tmp/screenshots/';

	grunt.file.mkdir('_Pdfs');

	this.createPdfsAndZips = function(){
		describe("Create pdf", function () {
		    it('Archiving and packing', function(done) {
				var arrayOfAllScreens = [];

			    var arrayOfScreens = [];

		        grunt.file.expand({cwd: '.tmp/screenshots/'}, '*').forEach(function(element, index){
		        	arrayOfScreens.push(element);
		        });

		        arrayOfScreens.alphanumSort(false);

		        browser.call(function () {
			        return new Promise(function(resolve, reject) {
			            pdfCreator.output(arrayOfScreens.map(function(d){return path + d;}), '_Pdfs/raw.pdf', function(err){
			            	if(err){
			            		console.log(err);
			            		reject();
			            	}

			            	resolve();
			            });
			        });
			    });
	        });
        });
	}
}
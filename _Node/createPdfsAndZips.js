module.exports = function(grunt) {
	var PDFImagePack = require("pdf-image-pack");
	var async = require('async');
	var path = '.tmp/screenshots/';
	var merge = require('easy-pdf-merge');

	grunt.file.mkdir('_Pdfs');
	grunt.file.mkdir('.tmp/pdfs/');

	this.createPdfsAndZips = function(sizes){
	    for(var j = 0; j < sizes.length; j++){
			generate(j, sizes);
	    }
	}

	function generate(j, sizes){
		grunt.file.mkdir(`.tmp/pdfs/${j}`);

		var width = sizes[j][0];
    	var height = sizes[j][1];

		describe(`Size ${width}x${height}`, function () {
	    	it(`Archiving and packing`, function() {
			    var arrayOfScreens = [];

		        grunt.file.expand({cwd: `${path}${j}/`}, '*').forEach(function(element, index){
		        	arrayOfScreens.push(element);
		        });

		        arrayOfScreens.alphanumSort(false);

		        var pdfTasks = [];

		        for(var i = 0; i < arrayOfScreens.length; i++){
		        	pdfTasks.push((function(i, j){
		        		return function(callback){
			        		new PDFImagePack().output(
			        			[`${path}${j}/${arrayOfScreens[i]}`], 
			        			((arrayOfScreens.length > 1) ? `.tmp/pdfs/${j}/${i}.pdf` : `_Pdfs/${j}/raw.pdf`),
			        			function(err){
					            	if(err){
					            		console.log(err);
					            	}

				            		callback();
				            	});
			        	};
		        	}(i, j)));
		        }

		        browser.call(function () {
			        return new Promise(function(resolve, reject) {
			            async.series(pdfTasks, function(){
			            	if(arrayOfScreens.length > 1){
			            		merge(arrayOfScreens.map(
			            			function(d, i){return `.tmp/pdfs/${j}/${i}.pdf`;}), 
			            			`_Pdfs/${contentJson.attributes.title}_${width}x${height}_${grunt.template.today('yyyy-mm-dd')}.pdf`,
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
        });
	}
}
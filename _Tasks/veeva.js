module.exports = function(grunt) {
    grunt.registerTask('package:veeva', ['clean:veeva', 'connect', 'webdriver:pdf', 'veeva', 'ftpscript:veeva', 'clean:build']);

    grunt.registerTask('veeva', function() {
        var flatBuild = getBuildTargets(grunt, {Nav:[{array:buildNavigation('_Build/sequences', grunt), level:"_Build/sequences"}]}.Nav, [], 0);

        var glob = require('glob');
        var jsdom = require("jsdom");
        var browsers = captureEnv().browsers;
		var sizes = captureEnv().sizes;

        reset = {
            compress: grunt.config.get('compress'),
            clean: grunt.config.get('clean'),
            concat: grunt.config.get('concat')
        };

        var ftp = grunt.config.get('targets').ftp['crm-13-ftp-us.veevacrm.com'];

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

        var concat = {
            default: {
                files: []
            }
        };

        var compress = {};
        var clean = {};

        clean.veeva = {
            src: []
        };

        for(var index = 0; index < flatBuild.length; index++){
			var element = flatBuild[index].target;
            var getAttr = grunt.file.readJSON(flatBuild[index].level + '/' + element +'/content.json');
            var zipName = (contentJson.attributes.title.replace(/[^a-zA-Z0-9 ]/g, "")).replace(/ /g,"-") + '-' + element;
            var seqName = (getAttr.attributes.Name === undefined) ? element : getAttr.attributes.Name;
            var screenshot = glob.sync(`.tmp/screenshots/${browsers[0]}/${sizes[0][0]}x${sizes[0][1]}/*_${element}_*.png`)
                .alphanumSort()[0];

        	copy.default.files.push(
                {
                    cwd: '_Output/' + element + '/',
                    src: '**',
                    dest: '_Packages/Veeva/' + zipName + '/',
                    expand: true
                },
	        	{
	                src: screenshot,
	                dest: '_Packages/Veeva/' + zipName + '/' + zipName + '-full.png'
	            }
            );

            shell.default.command.push(
            	`convert ${screenshot} -resize 250x250 _Packages/Veeva/${zipName}/${zipName}-thumb.png`
        	);

            concat.default.files.push(
                {
                    src: ['_Build/generated/veeva.js'], 
                    dest: '_Packages/Veeva/' + zipName + '/js/package.js'
                }
            );

            compress[element] = {
                "options": {'archive': '_Packages/Veeva/'+ zipName +'.zip'}, 
                'cwd': '_Packages/Veeva/'+ zipName +'/', 
                'src': ['**'],
                'expand': true
            };

            clean.veeva.src.push('_Packages/Veeva/' + zipName + '/');

            var document = jsdom.jsdom(seqName);

            var multiStr =  "USER=" + ftp.username + "\n" + 
                            "PASSWORD=" + ftp.password + "\n" + 
                            "FILENAME=" + zipName + ".zip\n" + 
                            "NAME=" + document.querySelector('body').textContent + "\n" +  
                            "VExternal_Id_vod__c=" + zipName;

            grunt.file.write('_Packages/Veeva/ctlfile/' + zipName + '.ctl', multiStr);
        }

        shell.default.command = shell.default.command.join(' && ');

        grunt.config.set('copy', copy);
        grunt.config.set('shell', shell);
        grunt.config.set('concat', concat);
        grunt.config.set('compress', compress);
        grunt.config.set('clean', clean);

        grunt.task.run('copy', 'shell', 'concat', 'compress', 'clean:veeva', 'reset');
    });
};
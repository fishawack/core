keyMessages = [
    {
        zipName: `${config.repo.name}`,
        seqName: contentJson.attributes.title,
        screenshotName: '*',
        root: config.root,
        veeva: {}
    }
];

module.exports = function(grunt) {
    grunt.registerTask('package:veeva', ['clean:veeva', 'connect', 'webdriver:pdf', 'veeva', 'veeva:mcl', 'ftpscript:veeva', 'clean:build']);

    grunt.registerTask('veeva:mcl', function() {
        const createCsvWriter = require('csv-writer').createArrayCsvWriter;

        let options = contentJson.attributes.veeva;

        if(typeof options !== "object"){
            options =  {
                id: config.repo.name
            };
        }

        var done = this.async();

        require("fs-extra").mkdirpSync(`_Packages/Veeva/`);

        createCsvWriter({
                path: `_Packages/Veeva/MCL${filename()}-${options.id}.csv`,
                header: require('../_Resources/Veeva/mcl.json')
            })
            .writeRecords([[
                    "",
                    `${options.id}_P`,
                    options.presentation || `${options.id}_${config.repo.name}`,
                    "",
                    options.presentation || `${options.id}_${config.repo.name}`,
                    "No",
                    "Presentation",
                    "Binder Lifecycle",
                    "", "",
                    "No",
                    "No",
                    options.product || "",
                    options.country || "",
                    options.start || "",
                    options.end || "",
                    "", "", "", "", "", "", "", "", "", "",
                    "Yes",
                    "",
                    "English",
                    "",
                    "No",
                    "",
                    "No",
                    `${options.id}_P`,
                    "", ""
                ]]
                .concat(
                    keyMessages.map((d, i) => {
                        return [
                            "",
                            `${options.id}_S${i + 1}`,
                            d.seqName,
                            d.seqName,
                            "",
                            "No",
                            "Slide",
                            "CRM Content Lifecycle",
                            `${options.id}_P`,
                            "No",
                            "", "", "", "", "", "", "", "",
                            "HTML",
                            "", "", "",
                            options.product || "",
                            options.country || "",
                            `${d.zipName}.zip`,
                            "No",
                            "",
                            "Yes",
                            "",
                            "English",
                            "",
                            "No",
                            "", "",
                            "WKWebView",
                            "Default For Device",
                            (d.veeva.disable || options.disable || []).join(', ')
                        ]
                    })
                )
            )
            .catch(err => console.log(err))
            .finally(() => done());
    });

    grunt.registerTask('veeva', function() {
        var glob = require('glob');
        var jsdom = require("jsdom");
        var browsers = captureEnv().browsers;
		var sizes = captureEnv().sizes;

        reset = {
            compress: grunt.config.get('compress'),
            clean: grunt.config.get('clean'),
            concat: grunt.config.get('concat'),
            copy: grunt.config.get('copy')
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

        var clean = {
            veeva: {
                src: []
            }
        };

        keyMessages.forEach(d => {
            var zipName = d.zipName;
            var seqName = d.seqName;
            var screenshotName = d.screenshotName;

            var screenshot = glob.sync(`.tmp/screenshots/${browsers[0]}/${sizes[0][0]}x${sizes[0][1]}/*_${screenshotName}_*.png`)
                .alphanumSort()[0];

        	copy.default.files.push(
                {
                    cwd: d.root,
                    src: '**',
                    dest: '_Packages/Veeva/' + zipName + '/',
                    expand: true
                },
	        	{
	                src: screenshot,
	                dest: '_Packages/Veeva/' + zipName + '/' + zipName + '-full.png'
	            },
	        	{
	                src: screenshot,
	                dest: '_Packages/Veeva/' + zipName + '/thumb.png'
	            }
            );

            shell.default.command.push(
            	`convert ${screenshot} -resize 250x250 _Packages/Veeva/${zipName}/${zipName}-thumb.png`
        	);

            concat.default.files.push(
                {
                    src: [
                        `${configPath}_Resources/Veeva/*.js`,
                        `_Packages/Veeva/${zipName}/js/script.js`
                    ],
                    dest: '_Packages/Veeva/' + zipName + '/js/script.js'
                }
            );

            compress[zipName] = {
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
        });

        shell.default.command = shell.default.command.join(' && ');

        grunt.config.set('copy', copy);
        grunt.config.set('shell', shell);
        grunt.config.set('concat', concat);
        grunt.config.set('compress', compress);
        grunt.config.set('clean', clean);

        grunt.task.run('copy', 'shell', 'concat', 'compress', 'clean:veeva', 'reset');
    });
};
module.exports = function(grunt) {
    grunt.registerTask('package:veeva', ['clean:veeva', 'veeva', 'veeva:mcl', 'ftpscript:veeva']);

    grunt.registerTask('veeva:mcl', function() {
        var done = this.async();

        const jsdom = require("jsdom");
        const fs = require("fs-extra");

        const createCsvWriter = require('csv-writer').createArrayCsvWriter;

        let options = typeof contentJson.attributes.veeva === "object" ? contentJson.attributes.veeva : {};
        options.id = options.id || config.repo.name;
        options.presentation = options.presentation || `${options.id}_${config.repo.name}`;
        
        fs.mkdirpSync(`_Packages/Veeva/`);

        createCsvWriter({
                path: `_Packages/Veeva/MCL${filename()}-${options.id}.csv`,
                header: require('../_Resources/Veeva/mcl.json')
            })
            .writeRecords([[
                    "",
                    `${options.id}_P`,
                    options.presentation,
                    "",
                    options.presentation,
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
                        var safeName = jsdom.jsdom(d.seqName).querySelector('body').textContent;

                        return [
                            "",
                            `${options.id}_S${i + 1}`,
                            safeName,
                            safeName,
                            "",
                            "No",
                            "Slide",
                            "CRM Content Lifecycle",
                            `${options.id}_P`,
                            "No",
                            "", "", "", "", "", "", "", "",
                            "HTML",
                            "",
                            options.sharedResource ? `${options.id}_SR` : "",
                            (d.veeva.disable || options.disable || []).join(', '),
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
                            "Default For Device"
                        ]
                    }),
                    options.sharedResource ? [[
                        "",
                        `${options.id}_SR`,
                        "Shared Resources",
                        "",
                        "",
                        "",
                        "Shared",
                        "CRM Content Lifecycle",
                        "",
                        "",
                        "", "", "", "", "", "", "", "",
                        "",
                        "", "",
                        "",
                        options.product || "",
                        "",
                        "veeva_shared_resource.zip",
                        "Yes",
                        "",
                        "Yes",
                        "",
                        "",
                        "",
                        "",
                        "", "",
                        "",
                        ""
                    ]] : []
                )
            )
            .catch(err => console.log(err))
            .finally(() => done());
    });

    grunt.registerTask('veeva', function() {
        const fs = require("fs-extra");
        const glob = require('glob');
        const jsdom = require("jsdom");
        var browsers = captureEnv().browsers;
		var sizes = captureEnv().sizes;

        let options = typeof contentJson.attributes.veeva === "object" ? contentJson.attributes.veeva : {};
        options.id = options.id || config.repo.name;

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

            var screenshot = glob.sync(`.tmp/screenshots/${browsers[0]}/${sizes[0][0]}x${sizes[0][1]}/*_${screenshotName}_*.png`);

            if(!screenshot.length){
                grunt.fatal(`No screenshots detected in .tmp/, do you need to run the capture task?`);
            }
            
            screenshot = screenshot.alphanumSort()[0];

        	copy.default.files.push(
                {
                    cwd: d.root,
                    src: ['**', '!styleguide.html'].concat((options.sharedResource) ? ['!shared/**'] : []),
                    dest: '_Packages/Veeva/' + zipName + '/',
                    expand: true,
                    follow: true
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

        if(options.sharedResource){
            if(fs.existsSync(`${config.root}/shared/`)){
                fs.writeFileSync(`${config.root}/shared/index.html`, "<html><title>Placeholder</title><body><h1>Placeholder!</h1></body></html>");
                fs.writeFileSync(`${config.root}/shared/thumb.png`, "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", { encoding: "base64" });
            }

            compress['veeva_shared_resource'] = {
                "options": {'archive': '_Packages/Veeva/veeva_shared_resource.zip'}, 
                'cwd': '<%= root %>/shared/', 
                'src': ['**'],
                'expand': true
            };
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
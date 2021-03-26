module.exports = function(grunt) {
    grunt.registerTask('package:phonegap', ['clean:phonegap', 'createConfigXml', 'copy:phonegap', 'cordova:build', 'cordova:release']);

    var platforms = contentJson.attributes.phonegap.platforms || ['ios'];
    var options = contentJson.attributes.phonegap || {};
    var os = require('os');

    grunt.registerTask('createConfigXml', function() {
        var xmlBuilder = require('xmlbuilder');

        var phonegap = JSON.parse(grunt.template.process(grunt.file.read(`${configPath}_Resources/Phonegap/cordova.json`)));

        platforms.forEach((platform) => {
            phonegap.widget.platform.push(
                _.mergeWith(
                    JSON.parse(grunt.file.read(`${configPath}_Resources/Phonegap/${platform}.json`)), 
                    options[platform] || {}, 
                    (obj, src) => {
                        if (_.isArray(obj)) {
                            return obj.concat(src);
                        }
                    }
                )
            );
        });

        phonegap = _.mergeWith(phonegap, options.config || {}, (obj, src) => {
            if (_.isArray(obj)) {
                return obj.concat(src);
            }
        });

        grunt.file.write('_Packages/Phonegap/config.xml', xmlBuilder.create(phonegap).end({ pretty: true}));
    });

    function cordova(arr){
        require('child_process').execSync([
            `cd _Packages/Phonegap/`
        ].concat(arr).join(' && '), {stdio: 'inherit', encoding: 'utf8'});
    }

    grunt.registerTask('cordova:build', () => cordova([
        `npm init -y`,
        `npx cordova platform add ${platforms.join(' ')}`
    ]));

    grunt.registerTask('cordova:emulate', () => cordova(platforms.map(platform => {
            // `npx cordova emulate ${platforms.join(' ')} --target="iPad-Air--4th-generation-, 14.4"`
            return `npx cordova emulate ${platform}`;
    })));

    grunt.registerTask('cordova:release', () => {
        cordova(platforms.map(platform => {
            if(platform === "ios"){
                return `npx cordova build ios --device --release --packageType="${options.packageType}" --provisioningProfile="${options.provisioningProfile}"`;
            } else {
                return `npx cordova build android --release -- --keystore="${os.homedir()}/targets/${options.keystore}.keystore" --storePassword="${config.targets.misc.android.keystore[options.keystore]}" --alias="fishawack" --password="${config.targets.misc.android.alias[options.keystore]}" --packageType=bundle`;
            }
        }));
    });
};